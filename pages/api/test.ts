import { NextApiRequest, NextApiResponse } from 'next'
import minio from '@lib/minio'
import parseForm from '@lib/parse-form'

export const config = {
	api: {
		bodyParser: false
	}
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	try {
		switch (method) {
			case 'POST': {
				const [fields, files] = await parseForm(req)

				const file = files.sample

				if (!Array.isArray(file)) {
					const temp = await minio.fPutObject(process.env.MINIO_PUBLIC_BUCKET, file.originalFilename!!, file.filepath, {
						'Content-Type': file.mimetype
					})
				}

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
