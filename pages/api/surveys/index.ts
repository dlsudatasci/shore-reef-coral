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
				const session = await getServerSession(req, res, authOptions)
				if (!session) return res.status(401)

				const form = formidable({ keepExtensions: true, multiples: true })
				const [fields, files] = await form.parse(req)

				const parsedData = parseFormidableOutput(fields)

				const [surveyInfo, team] = await Promise.all([
					surveyInfoSchema.validate(parsedData.surveyInfo),
					teamInfoSchema.validate(parsedData.team),
				])

				const { startCorner, endCorner, ...data } = surveyInfo

				const [startLongtitude, startLatitude] = startCorner.split(', ').map(n => parseFloat(n))
				const [secondLongtitude, secondLatitude] = endCorner.split(', ').map(n => parseFloat(n))

				const { id: surveyId } = await prisma.survey.create({
					select: {
						id: true
					},
					data: {
						startLongtitude,
						startLatitude,
						secondLongtitude,
						secondLatitude,
						...data,
						...team,
						submissionType: parsedData.uploads.submissionType,
						dataType: parsedData.uploads.dataType,
						tag: parsedData.uploads.submissionType === 'MANUAL' ? 'Photos only' : 'With data forms',
					}
				})

				const { uploads: fileData } = parseFormidableOutput(files)
				const upload = getUploader(process.env.MINIO_PRIVATE_BUCKET, surveyId)
				const uploadPromises: Promise<UploadedObjectInfo>[] = []

				switch (parsedData.uploads.submissionType) {
					case 'CPCE': {
						uploadPromises.push(upload('data/cpce', fileData.zip[0]))
						break
					}

					case 'ALWAN': {
						uploadPromises.push(upload('img/zip', fileData.zip[0]))
						uploadPromises.push(upload('data/alwan-data-form', fileData.alwanDataForm[0]))
						break
					}

					case 'MANUAL':
						uploadPromises.push(upload('img/zip', fileData.zip[0]))
						uploadPromises.push(upload('img/coral-data-sheet', fileData.coralDataSheet[0]))

						for (const [key, value] of Object.entries<File>(fileData.surveyGuides)) {
							uploadPromises.push(upload(`img/survey-guides-${key}`, value))
						}
						break
				}

				await Promise.all(uploadPromises)

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
