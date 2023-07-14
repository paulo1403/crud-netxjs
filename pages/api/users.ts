import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const users = await prisma.user.findMany();
    res.json(users);
  } else if (req.method === "POST") {
    const { name, email } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.json(user);
  } else if (req.method === "PUT") {
    const { id, name, email } = req.body;
    const user = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        email,
      },
    });
    res.json(user);
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    const user = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json(user);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
