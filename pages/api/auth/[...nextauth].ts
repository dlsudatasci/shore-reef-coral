import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma, PrismaClient } from '.prisma/client'
import { matchPassword } from '../../../lib/password-util';

export default NextAuth({
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'email', type: 'email' },
				password: { label: 'password', type: 'password' },
			},
			async authorize(credentials, req) {
				const prisma = new PrismaClient()

				if (!credentials) return null

				const user = await prisma.user.findFirst({ where: { email: credentials.email }})

				if (!user || !matchPassword(credentials.password, user.password, user.salt)) return null

				return {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			// Persist the OAuth access_token to the token right after signin
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
	},
});
