const { updateBalance } = require("../services/profiles");
const { getActiveSum } = require("../services/jobs");
const setBalance = async (req, res) => {
  try {
    const { id } = req.params;

    if (id != req.profile.id) return res.status(404).end();

    const amountToPay = await getActiveSum(req);

    // a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
    if (req.body.balance > amountToPay * 0.25) {
      return res
        .json({ error: "can't deposit more than 25% his total of jobs to pay" })
        .status(400)
        .end();
    }

    await updateBalance(req, req.profile.balance + req.body.balance);

    return res.status(200).end();
  } catch (e) {
    res.status(500).end();
  }
};

module.exports = { setBalance };
