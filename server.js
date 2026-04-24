import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

// const users = [];

//Criar usuários
app.post("/users", async (req, res) => {
  console.log(req.body);
  await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });
  res.status(201).json(req.body);
});
//Buscar Usuários
app.get("/users", async (req, res) => {
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
  // console.log(req);
  res.status(200).json(users);
});

//Atualizar Usuários
app.put("/users/:id", async (req, res) => {
  console.log(req);
  await prisma.user.update({
    where: {  
      id: req.params.id,
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });
  res.status(200).json(req.body);
});

//Deletar Usuários
app.delete("/users/:id", async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ message: "User deleted with success" });
  console.log(req);
});

app.listen(3000);
