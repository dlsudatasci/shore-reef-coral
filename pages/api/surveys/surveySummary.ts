import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@lib/prisma';

type SurveySummary = {
    id: number;
    date: string;
    stationName: string;
    startLongitude: number;
    startLatitude: number;
    dataType: string;
    isComplete: string;
    isVerified: string;
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

        const id = Number(req.query.teamId);

        const surveyInfo = await prisma.survey.findMany({
            where: {
              teamId: id,
            },
            select: {
                id: true,
                date: true,
                stationName: true,
                startLongitude: true,
                startLatitude: true,
                dataType: true,
                isComplete: true,
                isVerified: true
            }
          });

          const formatDate = (date: Date): string => {
            return date.toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour12: true,
                hour: '2-digit',
                minute: '2-digit'
            });
        };

          const surveySummary: SurveySummary[] = surveyInfo.map(survey => ({
            id: survey.id,
            date: formatDate(new Date(survey.date)),
            stationName: survey.stationName,
            startLongitude: survey.startLongitude,
            startLatitude: survey.startLatitude,
            dataType: survey.dataType,
            isComplete: survey.isComplete ? "COMPLETE" : "INCOMPLETE",
            isVerified: survey.isVerified ? "✓" : "X"
        }));

        res.status(200).json(surveySummary);
        } catch (error) {
      console.error('Error fetching teams:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }} 
}