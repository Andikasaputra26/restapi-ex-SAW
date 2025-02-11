const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
dotenv.config();

const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Hello Kamu");
});

app.get("/products", async (req, res) => {
  const product = await prisma.product.findMany();
  res.send(product);
});

app.post("/products", async (req, res) => {
  const newProductData = req.body;

  const products = await prisma.product.create({
    data: {
      name: newProductData.name,
      description: newProductData.description,
      price: newProductData.price,
      image: newProductData.image,
    },
  });
  res.send({
    data: products,
    message: "create products success",
  });
});

app.delete("/products/:id", async (req, res) => {
  const productId = req.params.id;
  await prisma.product.delete({
    where: {
      id: parseInt(productId),
    },
  });

  res.send("product deleted");
});

app.listen(PORT, () => {
  console.log("Express API running: " + PORT);
});
