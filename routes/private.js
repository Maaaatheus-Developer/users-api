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

//Delete Users
router.delete("/users/:id", async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "User deleted with success" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro no servidor 😓, tente novamente", error });
  }
});

//Update users
router.put("/users/:id", async (req, res) => {
  try {
    const data = {};
    if (req.body.email) data.email = req.body.email;
    if (req.body.name) data.name = req.body.name;
    if (req.body.age) data.age = req.body.age;
    const updateData = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data,
    });
    res.status(200).json(updateData);
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar usuário", error });
  }
});

export default router;
