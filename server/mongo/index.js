const envVars = require("../config/variables");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { debug: debugLog, error: errorLog, info: infoLog } = require("../utils/logger");

let client;

async function init() {
  try {
    if (!envVars.dbUri || !envVars.dbName) {
      return;
    }
    client = new MongoClient(envVars.dbUri, { serverApi: ServerApiVersion.v1 });
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });

    infoLog("Connected successfully to DB server");
  } catch (error) {
    debugLog(error);
    errorLog("Error in DB connection");
    process.exit(1);
  } finally {
    // Ensures that the client will close when you finish/error
    if (client !== undefined) {
      await client.close();
    }
  }
}


async function updateMetrics(collectionName = "user_metrics") {
  try {
    await client.connect();
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

    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: {
        visits: ++metric.visits,
        last_Accessed: istDate
      },
    };
    await collectionObj.updateOne({ _id: metric._id }, updateDoc);
  } finally {
    await client.close();
  }
}

async function fetchMetrics(collectionName = "user_metrics", metricToFetch = 'visits') {
  try {
    await client.connect();
    const database = client.db(envVars.dbName);
    const collectionObj = database.collection(collectionName);
    const metric = await collectionObj.findOne();

    debugLog({ metric });

    if (!metric || !metric.visits) {
      return;
    }
    return metric[metricToFetch]

  } finally {
    await client.close();
  }
}

module.exports = {
  init,
  updateMetrics,
  fetchMetrics
}
