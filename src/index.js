const express = require("express");
const cors = require("cors");

const criteriaRoutes = require("./routes/criteriaRoutes");
const alternatives = require("./routes/alternatives");
const calculate = require("./routes/calculate");
const scores = require("./routes/scores");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());

app.use("/criteria", criteriaRoutes);
app.use("/alternatives", alternatives);
app.use("/calculate", calculate);
app.use("/scores", scores);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
