import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
	interface Session {
		user: {
			id: number
			email: string
			firstName: string
			lastName: string
		} & DefaultSession['user']
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: number
		email: string
		firstName: string
		lastName: string
	}
}
