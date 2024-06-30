import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@lib/prisma';

type UpdateStatusRequest = {
  memberId: number;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  const memberId = Number(req.query.memberId);
  const teamId = Number(req.query.teamId);
  const isLeader = req.query.isLeader;

  console.log(method);
  console.log(memberId);
  console.log(teamId);
  console.log(isLeader);
  console.log(req.url);

  try {
    switch (method) {
      case "PUT": {
        if (!memberId) {
          return res.status(400).json({ message: 'Member ID is required' });
        }
        if (!teamId) {
          return res.status(400).json({ message: 'Team ID is required' });
        }
        if (isLeader == "true") {
          return res.status(400).json({ message: 'You can\'t remove the team leader' });
        }

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
      default: {
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
      }
    }
  } catch (error) {
    console.error('Error updating member status:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

export default handler;
