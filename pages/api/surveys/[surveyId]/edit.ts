import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "POST": {
      try {
        const session = await getSession({ req });

        if (!session?.user?.id) {
          return res.status(401).json({ message: 'Unauthorized' });
        }

        const id = Number(req.query.surveyId);
        const query = String(req.query.query);

        switch (query) {
          case 'complete': {
            await prisma.survey.update({
              where: {
                id,
              },
              data: {
                isComplete: true,
              },
            });
            break;
          }
          case 'verify': {
            await prisma.survey.update({
              where: {
                id,
              },
              data: {
                isVerified: true,
              },
            });
            break;
          }
          default: {
            res.setHeader('Allow', ['complete', 'verify']);
            return res.status(405).json({ message: `Query ${query} Not Allowed` });
          }
        }

        return res.status(200).json({ message: `Survey ${query}d successfully` });

      } catch (error) {
        console.error('Error updating survey:', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
      }
    }
    default: {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  }
}
