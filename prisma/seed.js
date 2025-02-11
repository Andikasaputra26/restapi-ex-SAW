const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  // Hapus semua data sebelum mengisi ulang
  await prisma.score.deleteMany({});
  await prisma.criteria.deleteMany({});
  await prisma.alternative.deleteMany({});

  // Buat data random untuk Criteria
  const criteriaTypes = ["benefit", "cost"];
  const criteriaData = Array.from({ length: 5 }, () => ({
    name: faker.word.adjective(),
    weight: parseFloat(faker.number.float({ min: 0.1, max: 1 }).toFixed(2)), // Bobot antara 0.1 - 1.0
    type: faker.helpers.arrayElement(criteriaTypes),
  }));

  const createdCriteria = await prisma.criteria.createMany({
    data: criteriaData,
  });

  console.log(`✅ Generated ${criteriaData.length} random criteria`);

  // Buat data random untuk Alternative
  const alternativeData = Array.from({ length: 10 }, () => ({
    name: faker.person.fullName(),
  }));

  const createdAlternatives = await prisma.alternative.createMany({
    data: alternativeData,
  });

  console.log(`✅ Generated ${alternativeData.length} random alternatives`);

  // Ambil semua criteria dan alternative yang sudah dibuat
  const allCriteria = await prisma.criteria.findMany();
  const allAlternatives = await prisma.alternative.findMany();

  // Buat data random untuk Score (hubungan antara Criteria dan Alternative)
  let scoresData = [];
  allAlternatives.forEach((alt) => {
    allCriteria.forEach((crit) => {
      scoresData.push({
        alternativeId: alt.id,
        criteriaId: crit.id,
        value: parseFloat(faker.number.float({ min: 1, max: 10 }).toFixed(2)), // Nilai skor antara 1 - 10
      });
    });
  });

  await prisma.score.createMany({
    data: scoresData,
  });

  console.log(
    `✅ Generated ${scoresData.length} scores for alternatives and criteria`
  );
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
