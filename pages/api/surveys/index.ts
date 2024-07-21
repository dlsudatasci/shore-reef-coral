import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import prisma from '@lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import formidable, { File } from 'formidable'
import { parseFormidableOutput } from '@lib/utils'
import minio from '@lib/minio'
import { surveyInfoSchema } from '@models/survey'
import { teamInfoSchema } from '@models/team'
import { UploadedObjectInfo } from 'minio'
import { SurveyDataType } from '@prisma/client'

export const config = {
	api: {
		bodyParser: false
	}
}

function getUploader(bucket: string, surveyId: number) {
	return (uploadPath: string, file: File) => {
		const ext = file.newFilename.split('.')[1]
		return minio.fPutObject(bucket, `${surveyId}/${uploadPath}.${ext}`, file.filepath)
	}
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	try {
		switch (method) {
			case 'POST': {
				// Session authentication
				const session = await getServerSession(req, res, authOptions)
				if (!session) return res.status(401)

				// Formidable file parsing
				const form = formidable({ keepExtensions: true, multiples: true, maxFileSize: 300 * 1024 * 1024 })
				const [fields, files] = await form.parse(req)
				const parsedData = parseFormidableOutput(fields)
				const { uploads: fileData } = parseFormidableOutput(files)

				// Get, validate, and format survey and team information
				const [surveyInfo, team] = await Promise.all([
					surveyInfoSchema.validate(parsedData.surveyInfo),
					teamInfoSchema.validate(parsedData.team),
				])

				const { startCorner, endCorner, ...data } = surveyInfo
				const [startLongitude, startLatitude] = startCorner.split(', ').map(n => parseFloat(n))
				const [secondLongitude, secondLatitude] = endCorner.split(', ').map(n => parseFloat(n))

				// Prisma transaction
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
		  
					const { id: c30ImageSetId } = await prisma.c30ImageSet.create({
						data: {
							surveyId: surveyId,
							imageCount: Object.keys(fileData.imageUpload).length,
						},
					});
					
					await prisma.coralAssessment.create({
						data: {
							imageSetId: c30ImageSetId,
							...team,
						}
					});

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
									excelFilePath: fileData.zip[0].originalFilename,
								}
							});
							break;
						
						case 'MANUAL':
							const surveyGuideCount = Object.keys(fileData.surveyGuides).length;
							var i;
							for (i = 0; i < surveyGuideCount; i++) {
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

				// const { uploads: fileData } = parseFormidableOutput(files)
				// const upload = getUploader(process.env.MINIO_PRIVATE_BUCKET, surveyId)
				// const uploadPromises: Promise<UploadedObjectInfo>[] = []

				// switch (parsedData.uploads.submissionType) {
				// 	case 'CPCE': {
				// 		uploadPromises.push(upload('data/cpce', fileData.zip[0]))
				// 		break
				// 	}

				// 	case 'ALWAN': {
				// 		uploadPromises.push(upload('img/zip', fileData.zip[0]))
				// 		uploadPromises.push(upload('data/alwan-data-form', fileData.alwanDataForm[0]))
				// 		break
				// 	}

				// 	case 'MANUAL':
				// 		uploadPromises.push(upload('img/zip', fileData.zip[0]))
				// 		uploadPromises.push(upload('img/coral-data-sheet', fileData.coralDataSheet[0]))

				// 		for (const [key, value] of Object.entries<File>(fileData.surveyGuides)) {
				// 			uploadPromises.push(upload(`img/survey-guides-${key}`, value))
				// 		}
				// 		break
				// }

				// await Promise.all(uploadPromises)

				// const data = await (await fetch('http://ccscloud2.dlsu.edu.ph:22302/app/extract')).json()
				// console.log(data)

				break
			}

			default:
				res.setHeader('Allow', ['POST'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		console.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default handler
