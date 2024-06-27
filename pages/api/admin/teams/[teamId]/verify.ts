import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import prisma from '@lib/prisma'
import { authOptions } from '@pages/api/auth/[...nextauth]'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    const teamId = Number(req.query.teamId)

    try {
        switch (method) {
            case 'POST': {
                const session = await getServerSession(req, res, authOptions)
                if (!session) return res.status(401)

                // Authenticate admin
                const count = await prisma.user.count({
                    where: {
                        id: session.user.id,
                        isAdmin: true
                    }
                })
                if (!count) return res.status(401)

                await prisma.team.update({
                    where: { id: teamId },
                    data: { isVerified: true }
                })

                res.status(200).json({ message: 'Team has been verified!' })
                break
            }
        }
    } catch (error) {
        console.error(error)
        res.status(500)
    } finally {
        res.end()
    }
}

export default handler