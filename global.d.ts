declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DB_URL: string
			MAIL_USER: string
			MAIL_PASS: string

			MINIO_URL: string
			MINIO_PORT: string
			MINIO_ACCESS_KEY: string
			MINIO_SECRET_KEY: string
			MINIO_PUBLIC_BUCKET: string
			MINIO_PRIVATE_BUCKET: string
			NEXT_PUBLIC_MINIO_PUBLIC_URL: string
		}
	}
}

export { }
