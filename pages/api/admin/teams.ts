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