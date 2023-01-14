
const express = require('express');
const router = express.Router();
const mongo = require("./mongo");

mongo.init();

const env = process.env.ENV || "DEV"

//routes
router.get('/', (req, res) => {

  const startDate = new Date('2016-7-1');
  const now = new Date();
  let year_experiance = ((now.getFullYear() - startDate.getFullYear()) * 12
    + (now.getMonth() - startDate.getMonth()));

  year_experiance = `${Math.floor(year_experiance / 12)}Y ${year_experiance % 12}M`;

  res.render('./index.ejs', { year_experiance });

  // Update Metrics for Prod
  if (env == "PROD") {
    mongo.updateMetrics().catch(console.dir);
  }
});

router.get('/health', (req, res) => {
  res.end("success");
});

module.exports = { router };
