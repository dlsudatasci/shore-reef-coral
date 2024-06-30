import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@lib/prisma';

type AvailableTeams = {
  id: number;
  name: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  const memberId = Number(req.query.memberId);
  const teamId = Number(req.query.teamId);
  const isLeader = req.query.isLeader;
  const destTeam = Number(req.query.destTeam);
  const userId = Number(req.query.userId);

  console.log(method);
  console.log(memberId);
  console.log(teamId);
  console.log(isLeader);
  console.log(destTeam);
  console.log(userId);
  console.log(req.url);

  try {
    if (!memberId) {
      return res.status(400).json({ message: 'Member ID is required' });
    }
    if (!teamId) {
      return res.status(400).json({ message: 'Team ID is required' });
    }
    if (isLeader == "true") {
      return res.status(400).json({ message: 'You can\'t edit a team leader' });
    }

    switch (method) {
      case "GET": {
        const availableTeams = await prisma.team.findMany({
          where: {
              id: {
                not: Number(teamId),
            }
          },
          select: {
            id: true,
            name: true,
          }
        });

        const mappedTeams: AvailableTeams[] = availableTeams
        .map(team => ({
          id: team.id,
          name: team.name
        }))

        console.log(mappedTeams);

        return res.status(200).json(mappedTeams);
      }
      case "PUT": {
        // Update member status to "INACTIVE"
        await prisma.usersOnTeams.update({
          where: {
            id: memberId,
            teamId: Number(teamId),
          },
          data: {
            status: "INACTIVE",
          },
        });

        return res.status(200).json({ message: 'Member status updated successfully' });
      }
      case "POST": {
        if (!destTeam) {
          return res.status(400).json({ message: 'Destination is required' });
        }
        if (!userId) {
          return res.status(400).json({ message: 'User ID is required '})
        }

        const userOnDestinationTeam = await prisma.usersOnTeams.findFirst({
          where: {
            id: userId,
            teamId: destTeam,
            status: {
              in: ['ACCEPTED', 'PENDING']
            }
          },
        });

        console.log(userOnDestinationTeam)

        if (userOnDestinationTeam) {
          return res.status(400).json({ message: 'User is already in the destination team' });
        }

        // Update teamId to "INACTIVE"
        await prisma.usersOnTeams.update({
          where: {
            id: memberId,
            teamId: Number(teamId),
          },
          data: {
            teamId: destTeam,
          },
        });

        return res.status(200).json({ message: 'Member status updated successfully' });
      }
      default: {
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
      }
    }
  } catch (error) {
    console.error('Error editing member:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

export default handler;
