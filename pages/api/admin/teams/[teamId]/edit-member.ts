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
        try {
          // Fetch teams where the user is accepted or pending
          const teamsOfUser = await prisma.usersOnTeams.findMany({
            where: {
              userId: userId,
              status: {
                in: ['ACCEPTED', 'PENDING']
              }
            },
            select: {
              team: {
                select: {
                  id: true
                }
              }
            }
          });
      
          // Extract team IDs where the user is already a member
          const teamIdsOfUser = teamsOfUser.map(userTeam => userTeam.team.id);
      
          // Fetch available teams that the user is not already a part of
          const availableTeams = await prisma.team.findMany({
            where: {
              id: {
                notIn: teamIdsOfUser
              }
            },
            select: {
              id: true,
              name: true
            }
          });
      
          // Map available teams to the desired structure
          const mappedTeams = availableTeams.map(team => ({
            id: team.id,
            name: team.name
          }));
      
          return res.status(200).json(mappedTeams);
        } catch (error) {
          console.error("Error fetching available teams:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
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
            userId: userId,
            teamId: destTeam,
            status: {
              in: ['ACCEPTED', 'PENDING']
            }
          },
          select: {
            id: true
          }
        });

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
