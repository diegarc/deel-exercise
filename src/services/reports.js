const { sequelize, Contract } = require("../model");
const { Op } = require("sequelize");
const calculateBestProfession = async (req) => {
  const { Job } = req.app.get("models");
  const { Contract } = req.app.get("models");
  const { Profile } = req.app.get("models");

  let filterStart = null;
  if (req.query.start) {
    const start = new Date(req.query.start);
    filterStart = { createdAt: { [Op.gte]: start } };
  }

  let filterEnd = null;
  if (req.query.end) {
    const end = new Date(req.query.end);
    end.setDate(end.getDate() + 1);
    filterEnd = { createdAt: { [Op.lt]: end } };
  }

  const job = await Job.findOne({
    attributes: [[sequelize.fn("sum", sequelize.col("price")), "total"]],
    where: sequelize.and({ paid: true }, filterStart, filterEnd),
    group: "Contract.Contractor.profession",
    include: { model: Contract, include: { model: Profile, as: "Contractor" } },
    order: [["total", "DESC"]],
  });

  return job.Contract.Contractor.profession;
};

const calculateBestClients = async (req) => {
  const { Job } = req.app.get("models");
  const { Contract } = req.app.get("models");
  const { Profile } = req.app.get("models");

  let filterStart = null;
  if (req.query.start) {
    const start = new Date(req.query.start);
    filterStart = { createdAt: { [Op.gte]: start } };
  }

  let filterEnd = null;
  if (req.query.end) {
    const end = new Date(req.query.end);
    end.setDate(end.getDate() + 1);
    filterEnd = { createdAt: { [Op.lt]: end } };
  }

  const jobs = await Job.findAll({
    attributes: [
      [sequelize.col("Contract.ClientId"), "id"],
      [sequelize.col("Contract.Client.firstName"), "firstName"],
      [sequelize.col("Contract.Client.lastName"), "lastName"],
      [sequelize.fn("sum", sequelize.col("price")), "paid"],
    ],
    where: sequelize.and({ paid: true }, filterStart, filterEnd),
    group: "Contract.ClientId",
    include: {
      model: Contract,
      attributes: [],
      include: { model: Profile, as: "Client" },
    },
    order: [["paid", "DESC"]],
    limit: req.query.limit || 2,
  });

  return jobs;
};

module.exports = { calculateBestProfession, calculateBestClients };
