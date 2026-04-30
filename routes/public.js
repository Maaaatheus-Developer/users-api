import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

//Register Users
router.post("/users", async (req, res) => {
  try {
    const user = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        age: user.age,
        password: hashPassword,
      },
    });
    res.status(201).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro no servidor 😓, tente novamente", err });
  }
});

router.post("/login", async (req, res) => {
  try {
    //Busca o usuário no banco de dados
    const userInfo = req.body;
    const user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    //Verifica se o usuário existe dentro do banco
    if (!user) {
      return res
        .status(404)
        .json({ message: "Ops 😕, O usuário não foi encontrado" });
    }

    const isMatch = await bcrypt.compare(userInfo.password, user.password);

    //Compare as senha do banco com a que o usuário digitou
    if (!isMatch) {
      return res.status(400).json({ message: "Senha inválida" });
    }

    //Gerar o token JWT
    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET,
      { expiresIn: "1H" },
    );
    res.status(200).json(token);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro no servidor 😓, tente novamente", err });
  }
});

export default router;
