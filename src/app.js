const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");
const { getContract, getContracts } = require("./controllers/contracts");
const { getUnpaid, pay } = require("./controllers/jobs");
const { setBalance } = require("./controllers/profiles");
const { getBestProfession, getBestClients } = require("./controllers/admin");

const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.get("/contracts/:id", getProfile, getContract);
app.get("/contracts", getProfile, getContracts);

app.get("/jobs/unpaid", getProfile, getUnpaid);
app.post("/jobs/:id/pay", getProfile, pay);

app.post("/balances/deposit/:id", getProfile, setBalance);

app.get("/admin/best-profession", getProfile, getBestProfession);
app.get("/admin/best-clients", getProfile, getBestClients);

module.exports = app;
