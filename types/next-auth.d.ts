import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

interface IDetails {
	id: number
	email: string
	firstName: string
	lastName: string
}

declare module 'next-auth' {
	interface Session { 
		user: IDetails & DefaultSession['user']
	}

	interface User {
		id: number
		email: string
		firstName: string
		lastName: string
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends IDetails {}
}
