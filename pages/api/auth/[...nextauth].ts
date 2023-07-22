import NextAuth, { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@lib/prisma'
import { matchPassword } from '@lib/password-util'

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'email', type: 'email' },
				password: { label: 'password', type: 'password' },
			},
			async authorize(credentials) {

				if (!credentials) return null

				const user = await prisma.user.findFirst({ where: { email: credentials.email } })

				if (!user) throw Error('Account with email does not exist. Please register first.')
				if (!matchPassword(credentials.password, user.password, user.salt)) throw Error('Invalid email and password combination.')

				return {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
				} as User
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id as number
				token.email = user.email
				token.firstName = user.firstName
				token.lastName = user.lastName
			}
			return token
		},
		async session({ session, token }) {
			session.user.firstName = token.firstName
			session.user.lastName = token.lastName
			session.user.id = token.id
			return session
		},
	},
}

export default NextAuth(authOptions)
