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

          if (!fs.existsSync(zipPath)) {
            return res.status(400).json({ error: 'Zip file does not exist' });
          }

          try {
            fs.accessSync(zipPath, fs.constants.R_OK);
          } catch (err) {
            return res.status(400).json({ error: 'Zip file is not readable' });
          }

          const extractedFiles: { originalFilename: string }[] = [];

          await new Promise<void>((resolve, reject) => {
            fs.createReadStream(zipPath)
              .pipe(unzipper.Parse())
              .on('entry', async (entry) => {
                let fileName = entry.path;
                const fileType = entry.type;

                const lastDotIndex = fileName.lastIndexOf('.');
                if (lastDotIndex !== -1) {
                  const namePart = fileName.substring(0, lastDotIndex);
                  const extensionPart = fileName.substring(lastDotIndex).toLowerCase();
                  fileName = namePart + extensionPart;
                }

                if (fileName.includes('/')) {
                  entry.autodrain();
                  return;
                }
          
                if (fileType === 'File') {
                  extractedFiles.push({ originalFilename: fileName });
                  entry.autodrain();
                } else {
                  entry.autodrain();
                }
              })
              .on('finish', resolve)
              .on('error', reject);
          });

          fileData.imageUpload = extractedFiles.filter(file => file.originalFilename.endsWith('.jpg') || file.originalFilename.endsWith('.jpeg') || file.originalFilename.endsWith('.png'));
          fileData.cpc = extractedFiles.filter(file => file.originalFilename.endsWith('.cpc'));
          fileData.excel = extractedFiles.filter(file => file.originalFilename.endsWith('.xlsx'));
        }

        const [surveyInfo, team] = await Promise.all([
          surveyInfoSchema.validate(parsedData.surveyInfo),
          teamInfoSchema.validate(parsedData.team),
        ]);

        const { startCorner, endCorner, ...data } = surveyInfo;
        const [startLongitude, startLatitude] = startCorner.split(', ').map(n => parseFloat(n));
        const [secondLongitude, secondLatitude] = endCorner.split(', ').map(n => parseFloat(n));

        await prisma.$transaction(async (prisma) => {
          var fileFound = true;
          const imgCount = Object.keys(fileData.imageUpload).length;
          
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

          if (imgCount >= 30 && imgCount <= 50) {
            switch (parsedData.uploads.submissionType) {
              case 'CPCE': 
                if (fileData.cpc[0] && fileData.excel[0]) {
                  await prisma.surveyFile.create({
                    data: {
                      surveyId: surveyId,
                      CPCEFilePath: fileData.cpc[0].originalFilename,
                      excelFilePath: fileData.excel[0].originalFilename
                    }
                  });
                }
                else {
                  fileFound = false;
                  return;
                }
                break;
              
              case 'ALWAN': 
                if (fileData.alwanDataForm[0]) {
                  await prisma.surveyFile.create({
                    data: {
                      surveyId: surveyId,
                      excelFilePath: fileData.alwanDataForm[0].originalFilename,
                    }
                  });
                }
                else {
                  fileFound = false;
                  return;
                }
                break;
              
              case 'MANUAL':
                const surveyGuideCount = Object.keys(fileData.surveyGuides).length;
                if (fileData.coralDataSheet[0]) {
                  await prisma.coralDatasheetImage.create({
                    data: {
                      surveyId: surveyId,
                      fileName: fileData.coralDataSheet[0].originalFilename,
                    }
                  });
                }
                else {
                  fileFound = false;
                  return;
                }
                for (let i = 0; i < surveyGuideCount; i++) {
                  if (fileData.surveyGuides[i]) {
                    await prisma.surveyGuideImage.create({
                      data: {
                        surveyId: surveyId,
                        fileName: fileData.surveyGuides[i].originalFilename,
                      }
                    });
                  }
                }
                break;
            }
            
            if (fileFound) {
              await prisma.survey.update({
                where: {
                  id: surveyId,
                },
                data: {
                  dbSurveyNum: formattedSurveyNumber,
                },
              });
    
              if (fileData.imageUpload) {
    
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
    
                for (var i = 0; i < imgCount; i++) {
                  if (fileData.imageUpload[i]) {
                    await prisma.c30Image.create({
                      data: {
                        imageSetId: c30ImageSetId,
                        fileName: fileData.imageUpload[i].originalFilename,
                      }
                    });
                  }
                }
              }
            }
            else {
              return;
            }
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
