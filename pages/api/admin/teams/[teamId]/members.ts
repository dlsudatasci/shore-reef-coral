import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@lib/prisma';

type UsersSummary = {
  id: number;
  affiliation: string | null;
  firstName: string;
  lastName: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  const { teamId } = req.query;

  if (!teamId) {
    return res.status(400).json({ message: 'Team ID is required' });
  }

  try {
    const members = await prisma.user.findMany({
      where: {
        UsersOnTeam: {
          some: {
            teamId: Number(teamId),
          },
        },
      },
      select: {
        id: true,
        affiliation: true,
        firstName: true,
        lastName: true,
      },
    });

    res.status(200).json(members as UsersSummary[]);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
}
