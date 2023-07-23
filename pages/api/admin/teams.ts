import { Prisma } from "@prisma/client";

export type TeamsSummary = Prisma.TeamGetPayload<typeof teams>

const teams = Prisma.validator<Prisma.TeamArgs>()({
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