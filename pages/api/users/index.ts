import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/prisma";
import { hashPassword } from "@lib/password-util";
import { Prisma } from "@prisma/client";

export type UsersSummary = Prisma.UserGetPayload<typeof users>;

const users = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    firstName: true,
    lastName: true,
    affiliation: true,
  },
});

const usersHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body, method } = req;

  try {
    switch (method) {
      case "GET": {
        const users = await prisma.user.findMany();
				res.json(users);
				break;
      }
      case "POST": {
        const noMatch =
          (await prisma.user.findFirst({ where: { email: body.email } })) ==
          null;

        if (noMatch) {
          await prisma.user.create({
            data: {
              ...body,
              ...hashPassword(body.password),
            },
          });
        } else {
          res.json({ email: "Email is already taken!" });
        }
        break;
      }

      default:
        res.setHeader("Allow", ["POST", "GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    res.status(500);
  } finally {
    res.end();
  }
};

export default usersHandler;
