import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '@lib/prisma';
import { authOptions } from '../auth/[...nextauth]';
import formidable, { File } from 'formidable';
import { parseFormidableOutput } from '@lib/utils';
import minio from '@lib/minio';
import { surveyInfoSchema } from '@models/survey';
import { teamInfoSchema } from '@models/team';
import { UploadedObjectInfo } from 'minio';
import { SurveyDataType } from '@prisma/client';

import unzipper from 'unzipper';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false
  }
};

function getUploader(bucket: string, surveyId: number) {
  return (uploadPath: string, file: File) => {
    const ext = file.newFilename.split('.').pop();
    return minio.fPutObject(bucket, `${surveyId}/${uploadPath}.${ext}`, file.filepath);
  };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  try {
    switch (method) {
      case 'POST': {
        const session = await getServerSession(req, res, authOptions);
        if (!session) return res.status(401).end();

        const form = formidable({ keepExtensions: true, multiples: true, maxFileSize: 300 * 1024 * 1024 });
        const [fields, files] = await form.parse(req);
        const parsedData = parseFormidableOutput(fields);
        const { uploads: fileData } = parseFormidableOutput(files);

        if (fileData.zip && fileData.zip[0]) {
          const zipPath = fileData.zip[0].filepath;

          console.log('Zip file path:', zipPath);

          if (!fs.existsSync(zipPath)) {
            console.error('Zip file does not exist');
            return res.status(400).json({ error: 'Zip file does not exist' });
          }

          try {
            fs.accessSync(zipPath, fs.constants.R_OK);
          } catch (err) {
            console.error('Zip file is not readable:', err);
            return res.status(400).json({ error: 'Zip file is not readable' });
          }

          const extractedFiles: { [key: string]: File } = {};

          await new Promise<void>((resolve, reject) => {
            fs.createReadStream(zipPath)
              .pipe(unzipper.Parse())
              .on('entry', (entry) => {
                const fileName = entry.path;
                const fileType = entry.type;
                console.log(fileName)
                if (fileName.includes('/')) {
                  console.log(fileName)
                  console.error(`Invalid file name: "${fileName}" contains a backslash.`);
                  entry.autodrain();
                  return;
                }
          
                if (fileType === 'File') {
                  const tempPath = `extracted/${fileName}`;
                  const writeStream = fs.createWriteStream(tempPath);
          
                  entry.pipe(writeStream);
          
                  writeStream.on('finish', () => {
                    extractedFiles[fileName] = {
                      filepath: tempPath,
                      newFilename: fileName,
                      originalFilename: fileName,
                      mimetype: 'application/octet-stream',
                      size: fs.statSync(tempPath).size
                    } as File;
                    console.log(`Extracted and saved file: ${fileName}`);
                  });
          
                  writeStream.on('error', (err) => {
                    console.error('Error writing extracted file:', err);
                    reject(err);
                  });
                } else {
                  entry.autodrain();
                }
              })
              .on('finish', () => {
                console.log('Extracted files:', Object.keys(extractedFiles));
                fileData.imageUpload = extractedFiles;
                resolve();
              })
              .on('error', (err) => {
                console.error('Error during unzip:', err);
                reject(err);
              });
          });
        }

        const [surveyInfo, team] = await Promise.all([
          surveyInfoSchema.validate(parsedData.surveyInfo),
          teamInfoSchema.validate(parsedData.team),
        ]);

        const { startCorner, endCorner, ...data } = surveyInfo;
        const [startLongitude, startLatitude] = startCorner.split(', ').map(n => parseFloat(n));
        const [secondLongitude, secondLatitude] = endCorner.split(', ').map(n => parseFloat(n));

        await prisma.$transaction(async (prisma) => {
          const { id: surveyId } = await prisma.survey.create({
            select: {
              id: true,
            },
            data: {
              startLongitude,
              startLatitude,
              secondLongitude,
              secondLatitude,
              ...data,
              ...team,
              submissionType: parsedData.uploads.submissionType,
              tag: parsedData.uploads.submissionType === 'MANUAL' ? 'Photos only' : 'With data forms',
              dataType: data.dataType as SurveyDataType,
              dbSurveyNum: 'ALWAN',
              uploaderId: session.user.id,
            },
          });

          const surveyNumber = surveyId.toString().padStart(4, '0');
          const formattedSurveyNumber = `ALWAN-${surveyNumber}`;

          await prisma.survey.update({
            where: {
              id: surveyId,
            },
            data: {
              dbSurveyNum: formattedSurveyNumber,
            },
          });

          if (fileData.imageUpload) {
            const imgCount = Object.keys(fileData.imageUpload).length;

            const { id: c30ImageSetId } = await prisma.c30ImageSet.create({
              data: {
                surveyId: surveyId,
                imageCount: imgCount,
              },
            });

            await prisma.coralAssessment.create({
              data: {
                imageSetId: c30ImageSetId,
                ...team,
              }
            });

            for (const [fileName, file] of Object.entries(fileData.imageUpload)) {
              await prisma.c30Image.create({
                data: {
                  imageSetId: c30ImageSetId,
                  fileName: fileName,
                }
              });
            }
          }

          switch (parsedData.uploads.submissionType) {
            case 'CPCE': 
              await prisma.surveyFile.create({
                data: {
                  surveyId: surveyId,
                  CPCEFilePath: fileData.zip[0].originalFilename,
                }
              });
              break;
            
            case 'ALWAN': 
              await prisma.surveyFile.create({
                data: {
                  surveyId: surveyId,
                  excelFilePath: fileData.alwanDataForm[0].originalFilename,
                }
              });
              break;
            
            case 'MANUAL':
              const surveyGuideCount = Object.keys(fileData.surveyGuides).length;
              for (let i = 0; i < surveyGuideCount; i++) {
                await prisma.surveyGuideImage.create({
                  data: {
                    surveyId: surveyId,
                    fileName: fileData.surveyGuides[i].originalFilename,
                  }
                });
              }
              
              await prisma.coralDatasheetImage.create({
                data: {
                  surveyId: surveyId,
                  fileName: fileData.coralDataSheet[0].originalFilename,
                }
              });
              break;
          }
        });

        res.status(200).json({ success: 'Files processed successfully' });
        break;
      }

      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.end();
  }
};

export default handler;
