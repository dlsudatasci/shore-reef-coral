import nodemailer from 'nodemailer'

export async function sendEmail(to: string, subject: string, html: string) {
	const user = process.env.MAIL_USER
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user,
			pass: process.env.MAIL_PASS,
		},
		tls: {
			rejectUnauthorized: false
		}
	})
	return await transporter.sendMail({ from: `Reef Mo <${user}>`, to, subject, html });
}

export async function sendPasswordReset(to: string, link: string) {
	return await sendEmail(to, '[Reef Mo] Password Reset', `
    <p>Good day!</p>
    <p>Please click on this <a href="${link}">link</a> to reset your password!</p>
    <p>The link will expire in 1 hour.</p>
  `);
}
