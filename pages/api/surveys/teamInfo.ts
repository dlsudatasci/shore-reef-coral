import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@lib/prisma';

type TeamsSummary = {
  teamId: number;
  teamName: string;
  leaderId: number;
  leaderFirstName: string;
  leaderLastName: string;
  leaderContactNo?: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<TeamsSummary[] | { message: string; error: any }>) {
  const { method } = req;
  
  switch (method){
    case "GET":{
      try {
        const session = await getSession({ req });

        if (!session?.user?.id) {
          return res.status(401);
        }

        const userId = Number(session.user.id);

        const userTeams = await prisma.usersOnTeams.findMany({
            where: {
              userId,
              status: "ACCEPTED"
            },
            include: {
              team: {
                select: {
                  id: true,
                  name: true,
                  UsersOnTeam: {
                    select: {
                      user: {
                        select: {
                          id: true,
                          firstName: true,
                          lastName: true,
                          contactNumber: true,
                        }
                      }
                    },
                    where: {
                      isLeader: true // Only select leaders of the team
                    },
                    take: 1 // Limit to one leader per team (assuming one leader per team)
                  }
                }
              }
            }
          });
      
          // Map Prisma result to match TeamsSummary type
          const mappedTeams: TeamsSummary[] = userTeams.map(userTeam => ({
            teamId: userTeam.team.id,
            teamName: userTeam.team.name,
            leaderId: userTeam.team.UsersOnTeam[0].user.id,
            leaderFirstName: userTeam.team.UsersOnTeam[0].user.firstName,
            leaderLastName: userTeam.team.UsersOnTeam[0].user.lastName,
            leaderContactNo: userTeam.team.UsersOnTeam[0].user.contactNumber ? userTeam.team.UsersOnTeam[0].user.contactNumber : "",
          }));
      
          res.status(200).json(mappedTeams);
        } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }} 
}