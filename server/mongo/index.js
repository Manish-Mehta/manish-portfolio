const envVars = require("../config/variables");
const configs = require("../config/");
const { MongoClient } = require("mongodb");
const { debug: debugLog, error: errorLog, info: infoLog } = require("../utils/logger");

let client;

async function init() {
  try {
    if (!envVars.dbUri || !envVars.dbName) {
      return;
    }
    client = new MongoClient(envVars.dbUri);
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
  } catch (error) {
    debugLog(error);
    errorLog("Error in DB connection");
    process.exit(1);
  } finally {
    infoLog("Connected successfully to DB server");
  }
}


async function updateMetrics(collectionName = "user_metrics", params) {
    const database = client.db(envVars.dbName);
    const collectionObj = database.collection(collectionName);
    const metric = await collectionObj.findOne();
    // { visits: 0, last_Accessed: Date()}

    debugLog({ metric });

    const istDate = (new Date()).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

    if (!metric || !metric.visits) {
      const doc = {
        visits: 1000,
        last_Accessed: istDate
      }
      debugLog({ doc });

      const result = await collectionObj.insertOne(doc);
      infoLog(`First doc inserted: ${result.insertedId}`);
      return;
    }
  
    source = configs.sourceParams[params.s] || configs.sourceParams["o"];
  
    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: {
        visits: ++metric.visits,
        last_Accessed: istDate,
        [source]: ++metric[source]
      },
    };
    await collectionObj.updateOne({ _id: metric._id }, updateDoc);
}

async function fetchMetrics(collectionName = "user_metrics", metricToFetch = 'visits') {
    const database = client.db(envVars.dbName);
    const collectionObj = database.collection(collectionName);
    const metric = await collectionObj.findOne();

    debugLog({ metric });

    if (!metric || !metric.visits) {
      return;
    }
    return metric[metricToFetch]
  } 

module.exports = {
  init,
  updateMetrics,
  fetchMetrics
}
