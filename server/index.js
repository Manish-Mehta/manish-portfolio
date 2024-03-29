
const envVars = require("./config/variables");
const express = require('express');
const router = express.Router();
const mongo = require("./mongo");
const { info: infoLog } = require("./utils/logger");

// Start DB for Prod
if (envVars.env == "PROD") {
	infoLog(`Initiating DB connection`);
  mongo.init();
}

//routes
router.get('/', async (req, res) => {

  const startDate = new Date('2016-7-1');
  const now = new Date();
  let year_experiance = ((now.getFullYear() - startDate.getFullYear()) * 12
    + (now.getMonth() - startDate.getMonth()));

  year_experiance = `${Math.floor(year_experiance / 12)}Y ${year_experiance % 12}M`;

  let portfolio_visit = 1000;

  if (!req.query.nocount && envVars.env == "PROD") {
    portfolio_visit = (await mongo.fetchMetrics().catch(console.dir)) || portfolio_visit;
  }

  res.render('./index.ejs', { year_experiance, portfolio_visit });

  // Update Metrics for Prod
  if (!req.query.nocount && envVars.env == "PROD") {
    mongo.updateMetrics(undefined, req.query).catch(console.dir);
  }
});

router.get('/health', (req, res) => {
  res.end("success");
});

module.exports = { router };
