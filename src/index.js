const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
dotenv.config();

const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT;

app.get("/api", (req, res) => {
  res.send("Hello Kamu");
});

app.get("/products", async (req, res) => {
  const product = await prisma.product.findMany();
  res.send(product);
});

app.listen(PORT, () => {
  console.log("Express API running: " + PORT);
});
