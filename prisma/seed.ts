import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
	prisma.managementType.createMany({
		data: [
			{
				type: 'None',
			},
			{
				type: 'Locally managed MPA',
			},
			{
				type: 'Nationally managed MPA',
			}
		],
		skipDuplicates: true,
	})
}

main()
	.then(async () => await prisma.$disconnect())
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
