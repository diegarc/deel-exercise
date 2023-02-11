const { Op } = require("sequelize");
const { sequelize } = require("../model");

const getActiveUnpaid = async (req) => {
  const { Job } = req.app.get("models");
  const { Contract } = req.app.get("models");

  return await Job.findAll({
    where: { paid: { [Op.not]: true } },
    include: {
      model: Contract,
      where: sequelize.and(
        { status: "in_progress" },
        filterByContractorClient(req)
      ),
    },
  });
};

const getUnpaidJob = async (req) => {
  const { id } = req.params;
  const { Job } = req.app.get("models");
  const { Contract } = req.app.get("models");

  return await Job.findOne({
    where: { id, paid: { [Op.not]: true } },
    include: {
      model: Contract,
      where: sequelize.and(
        { status: "in_progress" },
        filterByContractorClient(req)
      ),
    },
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

const markAsPaid = async (req, transaction) => {
  const { id } = req.params;
  const { Job } = req.app.get("models");

  await Job.update(
    { paid: true, paymentDate: new Date() },
    { where: { id }, transaction }
  );
};

const getActiveSum = async (req) => {
  const { Job } = req.app.get("models");
  const { Contract } = req.app.get("models");

  return await Job.sum("price", {
    where: { paid: { [Op.not]: true } },
    include: {
      model: Contract,
      where: sequelize.and(
        { status: ["new", "in_progress"] },
        { ClientId: req.profile.id }
      ),
    },
  });
};

module.exports = { getActiveUnpaid, getUnpaidJob, markAsPaid, getActiveSum };
