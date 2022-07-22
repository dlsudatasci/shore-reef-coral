import { NextApiRequest, NextApiResponse } from 'next'
import { ContactSchema } from '@pages'
import { sendEmail } from '@lib/send-email'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body, method } = req
	const data = body as ContactSchema

	try {
		switch (method) {
			case 'POST': {
				if (data.email && data.message && data.name) {
					await sendEmail(process.env.MAIL_USER, 'New Message', `
						<p><b>From:</b> ${data.name} (${data.email})</p>
						<p>${data.message}</p>
					`)
				} else {
					throw Error('Information is incomplete!')
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
