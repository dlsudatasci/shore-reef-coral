import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ message: string; error: any }>) {
  const { method } = req;
  
  switch (method){
    case "POST":{
      try {
        const session = await getSession({ req });

        if (!session?.user?.id) {
          return res.status(401);
        }

        const id = Number(req.query.surveyId);
        const query = String(req.query.query);
        console.log(query)

        switch (query) {
          case 'complete': {
            await prisma.survey.update({
              where: {
                id,
              },
              data: {
                  isComplete: true
              }
            });
            break;
          }
          case 'verify': {
            await prisma.survey.update({
              where: {
                id,
              },
              data: {
                  isVerified: true
              }
            });
            break;
          }
          default: {
            res.setHeader('Allow', ['complete', 'verify']);
				    res.status(405).end(`Method ${query} Not Allowed`);
          }
        }

        res.status(200);

        } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }} 
}