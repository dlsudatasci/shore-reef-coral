import { Client } from 'minio'

const minio = new Client({
	endPoint: process.env.MINIO_URL,
	port: Number(process.env.MINIO_PORT),
	accessKey: process.env.MINIO_ACCESS_KEY,
	secretKey: process.env.MINIO_SECRET_KEY,
	useSSL: false,
})

export default minio
