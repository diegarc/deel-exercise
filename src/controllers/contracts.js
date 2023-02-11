const {
  getActiveContracts,
  getContractById,
} = require("../services/contracts");

const getContract = async (req, res) => {
  try {
    const contract = await getContractById(req);

    if (!contract) return res.status(404).end();

    res.json(contract);
  } catch (e) {
    res.status(500).end();
  }
};

const getContracts = async (req, res) => {
  try {
    const contracts = await getActiveContracts(req);

    res.json(contracts);
  } catch (e) {
    res.status(500).end();
  }
};

module.exports = { getContract, getContracts };
