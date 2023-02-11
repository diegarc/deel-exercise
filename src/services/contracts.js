const { sequelize } = require("../model");

const getContractById = async (req) => {
  const { Contract } = req.app.get("models");
  const { id } = req.params;

  return await Contract.findOne({
    where: sequelize.and({ id }, filterByContractorClient(req)),
  });
};
const getActiveContracts = async (req, profileId) => {
  const { Contract } = req.app.get("models");

  return await Contract.findAll({
    where: sequelize.and(
      { status: ["new", "in_progress"] },
      filterByContractorClient(req)
    ),
  });
};

const filterByContractorClient = (req) => {
  return sequelize.or(
    {
      ContractorId: req.profile.id,
    },
    {
      ClientId: req.profile.id,
    }
  );
};

module.exports = { getContractById, getActiveContracts };
