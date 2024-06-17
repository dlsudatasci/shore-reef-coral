import { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from "@prisma/client";

export type TeamsSummary = Prisma.TeamGetPayload<typeof teamsSummary>

const teamsSummary = Prisma.validator<Prisma.TeamDefaultArgs>()({
	select: {
    id: true,
    name: true,
    province: true,
    isVerified: true,
    town: true,
    affiliation: true,
    UsersOnTeam: {
      select: {
        userId: true,
        isLeader: true,  
        user: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    }
	}
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const teams = await prisma.team.findMany({
          ...teamsSummary,
        })
        res.json(teams)
        break
      }

      default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (err) {
    console.error(err)
    res.status(500)
  } finally {
    res.end()
  }
}

export default handler