import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
// Get Users
router.get("/users", async (req, res) => {
  try {
    let users = [];
    if (req.query) {
      users = await prisma.user.findMany({
        where: {
          name: req.query.name,
          email: req.query.email,
          age: req.query.age,
        },
      });
    } else {
      const users = await prisma.user.findMany();
    }
    res
      .status(200)
      .json({ message: "Usuários listados com sucesso! 😁", users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro no servidor 😓, tente novamente", error });

    console.log(error);
  }
});

// Get specific user
router.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro no servidor 😓, tente novamente", error });
  }
});

export default router;
