declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DB_URL: string;
			MAIL_USER: string;
			MAIL_PASS: string
		}
	}
}
