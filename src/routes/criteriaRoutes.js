const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// CREATE Criteria
router.post("/", async (req, res) => {
  try {
    const { name, weight, type } = req.body;
    const criteria = await prisma.criteria.create({
      data: { name, weight, type },
    });

    res.status(201).json({
      data: criteria,
      message: "Criteria created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create criteria" });
  }
});

// READ Criteria
router.get("/", async (req, res) => {
  try {
    const criteria = await prisma.criteria.findMany();
    res.json(criteria);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch criteria" });
  }
});

// UPDATE Criteria
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, weight, type } = req.body;

    const updatedCriteria = await prisma.criteria.update({
      where: { id: parseInt(id) },
      data: { name, weight, type },
    });

    res.json({
      data: updatedCriteria,
      message: "Criteria updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update criteria" });
  }
});

// DELETE Criteria
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.criteria.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Criteria deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete criteria" });
  }
});

module.exports = router;
