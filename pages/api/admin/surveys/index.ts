import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from "@prisma/client"

// Authentication
import { getServerSession } from 'next-auth/next'
import prisma from '@lib/prisma'
import { authOptions } from '@pages/api/auth/[...nextauth]'

export type SurveySummary = Prisma.SurveyGetPayload<typeof surveySummary>;

const surveySummary = Prisma.validator<Prisma.SurveyDefaultArgs>()({
	select: {
		id: true,
		date: true,
		stationName: true,
		uploader: {
			select: {
				firstName: true,
				lastName: true,
			}
		},
		leader: {
			select: {
				firstName: true,
				lastName: true,
			}
		},
		dataType: true,
		isComplete: true,
		isVerified: true,
	}
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, query } = req;

	try {
		switch (method) {
			case 'GET': {
				const session = await getServerSession(req, res, authOptions)
				if (!session) return res.status(401)

				// Authenticate admin
				const count = await prisma.user.count({
					where: {
						id: session.user.id,
						isAdmin: true
					}
				})
				if (!count) return res.status(401)

				// Pagination
				const page = parseInt(query.page as string) || 1;
				const pageSize = parseInt(query.pageSize as string) || 15;
				const skip = (page - 1) * pageSize;

				// Sorting
				const sortBy = (query.sortBy as string) || 'date';
				const sortOrder = (query.sortOrder as string) === 'asc' ? 'asc' : 'desc';

				// Mapping sortBy to Prisma fields
				const sortField = (() => {
					switch (sortBy) {
						case 'uploader':
							return { uploader: { lastName: sortOrder } };
						case 'leader':
							return { leader: { lastName: sortOrder } };
						default:
							return { [sortBy]: sortOrder };
					}
				})();

				// Filtering
				const filters: Prisma.SurveyWhereInput = {};
				if (query.stationName) {
					filters.stationName = {
						contains: query.stationName as string,
					};
				}
				if (query.teamId) {
					filters.teamId = parseInt(query.teamId as string);
				}

				// Fetch surveys
				const [surveys, total] = await prisma.$transaction([
					prisma.survey.findMany({
						where: filters,
						orderBy: sortField as any,
						skip: skip,
						take: pageSize,
						...surveySummary
					}),
					prisma.survey.count({
						where: filters,
					}),
				]);

				const totalPages = Math.ceil(total / pageSize);
				res.json({ surveys, totalPages, currentPage: page, pageSize });
			}
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	} finally {
		res.end();
	}
}

export default handler;