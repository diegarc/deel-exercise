const {
  getActiveUnpaid,
  getUnpaidJob,
  markAsPaid,
} = require("../services/jobs");
const { updateBalance } = require("../services/profiles");
const { sequelize } = require("../model");

const getUnpaid = async (req, res) => {
  try {
    const jobs = await getActiveUnpaid(req);

    res.json(jobs);
  } catch (e) {
    res.status(500).end();
  }
};

const pay = async (req, res) => {
  try {
    const job = await getUnpaidJob(req);

    if (!job) return res.status(404).end();

    if (job.price > req.profile.balance) {
      return res.json({ error: "Not enough balance" }).status(400).end();
    }

    const transaction = await sequelize.transaction();
    try {
      await markAsPaid(req, transaction);
      await updateBalance(req, req.profile.balance - job.price, transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }

    return res.status(200).end();
  } catch (e) {
    res.status(500).end();
  }
};

module.exports = { getUnpaid, pay };
