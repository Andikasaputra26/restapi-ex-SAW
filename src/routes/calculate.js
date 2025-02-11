const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function calculateSAW() {
  try {
    // Ambil semua data Criteria dan Alternative
    const criteria = await prisma.criteria.findMany();
    const alternatives = await prisma.alternative.findMany({
      include: { scores: true },
    });

    // Ambil nilai maksimum dan minimum untuk normalisasi
    let maxValues = {};
    let minValues = {};

    for (const crit of criteria) {
      const scores = await prisma.score.findMany({
        where: { criteriaId: crit.id },
      });

      const values = scores.map((s) => s.value);
      maxValues[crit.id] = Math.max(...values);
      minValues[crit.id] = Math.min(...values);
    }

    // Hitung Normalisasi
    let normalizedScores = [];
    alternatives.forEach((alt) => {
      let totalScore = 0;
      let normalizedData = { alternative: alt.name, scores: [] };

      alt.scores.forEach((score) => {
        const criteriaData = criteria.find((c) => c.id === score.criteriaId);
        let normalizedValue = 0;

        if (criteriaData.type === "benefit") {
          normalizedValue = score.value / maxValues[criteriaData.id];
        } else {
          normalizedValue = minValues[criteriaData.id] / score.value;
        }

        let weightedScore = normalizedValue * criteriaData.weight;
        totalScore += weightedScore;

        normalizedData.scores.push({
          criteria: criteriaData.name,
          rawValue: score.value,
          normalizedValue,
          weightedScore,
        });
      });

      normalizedData.totalScore = totalScore;
      normalizedScores.push(normalizedData);
    });

    return normalizedScores;
  } catch (error) {
    console.error("Error in SAW calculation:", error);
    return [];
  }
}

router.get("/calculate", async (req, res) => {
  try {
    const results = await calculateSAW();
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate SAW" });
  }
});

module.exports = router;
