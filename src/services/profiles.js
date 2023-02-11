const updateBalance = async (req, balance, transaction = null) => {
  const { Profile } = req.app.get("models");

  await Profile.update(
    { balance },
    { where: { id: req.profile.id }, transaction }
  );
};

module.exports = { updateBalance };
