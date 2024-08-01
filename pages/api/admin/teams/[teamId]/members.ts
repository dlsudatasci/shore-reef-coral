import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@lib/prisma';

type UsersSummary = {
	id: number;
	userId: number;
	affiliation: string | null;
	firstName: string;
	lastName: string;
	teamId: number;
	isLeader: boolean;
	status: string;
  };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  const { teamId } = req.query;

  if (!teamId) {
    return res.status(400).json({ message: 'Team ID is required' });
  }

  
  try {
	const members = await prisma.usersOnTeams.findMany({
	  where: {
		teamId: Number(teamId),
		status: {
		  in: ["ACCEPTED", "PENDING"]
		}
  	},
	  select: {
		id: true,
		teamId: true,
		status: true,
		isLeader: true,
		user: {
		  select: {
			affiliation: true,
			firstName: true,
			lastName: true,
			id: true
		  }
		}
	  }
	});

    // Map Prisma result to match UsersSummary type
    const mappedMembers: UsersSummary[] = members
		.map(member => ({
			id: member.id,
			isLeader: member.isLeader,
			affiliation: member.user?.affiliation,
			firstName: member.user?.firstName,
			lastName: member.user?.lastName,
			teamId: member.teamId,
			status: member.status || "UNKNOWN",
			userId: member.user?.id
		}))

    res.status(200).json(mappedMembers); // Return mappedMembers instead of members
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
}
