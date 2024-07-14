import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@lib/prisma';

type SurveySummary = {
    date: Date;
    stationName: string;
    startLongtitude: number;
    startLatitude: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<SurveySummary[] | { message: string; error: any }>) {
  const { method } = req;
  
  switch (method){
    case "GET":{
      try {
        const session = await getSession({ req });

        if (!session?.user?.id) {
          return res.status(401);
        }

        const id = Number(req.query.surveyId);

        const surveyInfo = await prisma.survey.findMany({
            where: {
              id,
            },
            select: {
                date: true,
                stationName: true,
                startLongtitude: true,
                startLatitude: true
            }
          });
      
          res.status(200).json(surveyInfo);
        } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }} 
}