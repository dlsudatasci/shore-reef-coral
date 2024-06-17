import { Prisma } from "@prisma/client";

export type TeamsSummary = Prisma.TeamGetPayload<typeof teams>

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
      }
    }
	}
})