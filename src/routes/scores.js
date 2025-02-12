const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/scores", async (req, res) => {
  try {
    const { alternativeId, criteriaId, value } = req.body;
    const score = await prisma.score.create({
      data: { alternativeId, criteriaId, value },
    });
    res.json(score);
  } catch (error) {
    // res.status(500).json({ error: "Failed to create score" });
  }
});

router.get("/scores", async (req, res) => {
  try {
    const scores = await prisma.score.findMany();
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

router.put("/scores/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { alternativeId, criteriaId, value } = req.body;
    const score = await prisma.score.update({
      where: { id: parseInt(id) },
      data: { alternativeId, criteriaId, value },
    });
    res.json(score);
  } catch (error) {
    res.status(500).json({ error: "Failed to update score" });
  }
});

router.delete(
  "/scores/:id",
  async (req, res) =>
    await prisma.score.delete({
      where: { id: parseInt(req.params.id) },
    })
);
module.exports = router;
