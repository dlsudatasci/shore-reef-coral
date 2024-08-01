import { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, TeamStatus } from "@prisma/client"

// Authentication
import { getServerSession } from 'next-auth/next'
import prisma from '@lib/prisma'
import { authOptions } from '@pages/api/auth/[...nextauth]'

export type TeamsSummary = Prisma.TeamGetPayload<typeof teamsSummary>

const teamsSummary = Prisma.validator<Prisma.TeamDefaultArgs>()({
	select: {
    id: true,
    name: true,
    province: true,
    town: true,
    affiliation: true,
    isVerified: true,
    status: true,
    UsersOnTeam: {
      select: {
        userId: true,
        isLeader: true,  
        status: true,
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
  const { method, query } = req;

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

        const { name, town, province, status } = query;

        // Initialize the where clause
        const where: Prisma.TeamWhereInput = {};

        // Apply filters
        if (name) where.name = { contains: String(name) };
        if (province) where.province = { equals: String(province) };
        if (town) where.town = { contains: String(town) };
        if (status) where.status = { equals: status as TeamStatus };
        if (!status) where.status = { not: 'PENDING' };

        // Execute the query with the built where clause
        const teams = await prisma.team.findMany({
          ...teamsSummary,
          where,
        });

        res.json(teams);
        break;
      }

      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    res.end();
  }
};

export default handler