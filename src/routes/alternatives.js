const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const alternative = await prisma.alternative.create({
      data: { name },
    });
    res.status(201).json({
      data: alternative,
      message: "Alternative created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create alternative" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const alternative = await prisma.alternative.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json(alternative);
  } catch (error) {
    res.status(500).json({ error: "Failed to update alternative" });
  }
});

router.get("/", async (req, res) => {
  try {
    const alternatives = await prisma.alternative.findMany();
    res.json(alternatives);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch alternatives" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.alternative.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Alternative deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete alternative" });
  }
});

module.exports = router;
