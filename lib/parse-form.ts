import { Fields, Files, IncomingForm } from 'formidable'
import { IncomingMessage } from 'http';

const parseForm = (req: IncomingMessage) => {
	const form = new IncomingForm({ keepExtensions: true, allowEmptyFiles: false, multiples: true })

	return new Promise<[Fields, Files]>((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) reject(err)
			else resolve([fields, files])
		})
	})
}

export default parseForm
