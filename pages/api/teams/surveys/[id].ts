import prisma from "@lib/prisma";
import { Prisma, Status } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  const session = await getSession({ req });
  if (!session) return res.status(401);
  const id = Number(req.query.id);

  try {
    switch (method) {
      case "GET": {
        if (id) {
          const survey = await prisma.survey.findFirst({
            where: {
              id,
            },
          });

          res.json(survey);
        }
        break;
      }

      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    res.status(500);
  } finally {
    res.end();
  }
};

export default handler;
