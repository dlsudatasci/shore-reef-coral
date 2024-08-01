import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import prisma from '@lib/prisma'
import { authOptions } from '@pages/api/auth/[...nextauth]'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
	const teamId = Number(req.query.teamId)
    const reason = req.body.reason

    try {
        switch (method) {
            case 'POST': {
                if (!reason || reason.trim() === '') {
                    return res.status(400).json({ error: 'Rejection reason is required.' });
                }

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

                await prisma.$transaction([
                    prisma.team.update({
                        where: { id: teamId },
                        data: { status: 'REJECTED' }
                    }),
                    prisma.rejectionReason.create({
                        data: {
                            teamId: teamId,
                            reason: reason
                        }
                    })
                ])

                res.status(200).json({ message: 'Team has been rejected!' })
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