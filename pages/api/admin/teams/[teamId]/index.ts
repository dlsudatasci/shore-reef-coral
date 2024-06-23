import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import prisma from '@lib/prisma'
import { authOptions } from '@pages/api/auth/[...nextauth]'
import { Prisma } from '@prisma/client'

export type TeamData = Prisma.TeamGetPayload<typeof teamData>

const teamData = Prisma.validator<Prisma.TeamDefaultArgs>()({
    select: {
        id: true,
        name: true,
        province: true,
        town: true,
        affiliation: true,
        isVerified: true,
        status: true,
    }
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    const teamId = Number(req.query.teamId)

    try {
        switch (method) {
            case 'GET': {
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

                const team = await prisma.team.findUnique({
                    ...teamData,
                    where: { id: teamId }
                })
                if (!team) return res.status(404).json({ message: 'Team not found' })
                res.json(team)
                break
            }
        }
    } catch (err) {
        console.error(err)
        res.status(500)
    } finally {
        res.end()
    }

}

export default handler