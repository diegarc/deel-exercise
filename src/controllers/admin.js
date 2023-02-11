const {
  calculateBestProfession,
  calculateBestClients,
} = require("../services/reports");
const getBestProfession = async (req, res) => {
  try {
    const maxProfession = await calculateBestProfession(req);

    res.json(maxProfession);
  } catch (e) {
    res.status(500).end();
  }
};

const getBestClients = async (req, res) => {
  try {
    const bestClients = await calculateBestClients(req);

    res.json(bestClients);
  } catch (e) {
    res.status(500).end();
  }
};

module.exports = { getBestProfession, getBestClients };
