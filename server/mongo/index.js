const { MongoClient, ServerApiVersion } = require("mongodb");


const dbName = process.env.DB_NAME;
const dbUri = process.env.DB_URI;
const client = new MongoClient(dbUri, { serverApi: ServerApiVersion.v1 });

async function init() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to DB server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


async function updateMetrics(collectionName = "user_metrics") {
  try {
    await client.connect();
    const database = client.db(dbName);
    const collectionObj = database.collection(collectionName);
    const metric = await collectionObj.findOne();
    // { visits: 0, last_Accessed: Date()}

    console.log({ metric });

    if (!metric || !metric.visits) {
      const doc = {
        visits: 1,
        last_Accessed: (new Date()).toString()
      }
      console.log({ doc });

      const result = await collectionObj.insertOne(doc);
      console.log(`First doc inserted: ${result.insertedId}`);
      return;
    }

    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: {
        visits: ++metric.visits,
        last_Accessed: (new Date()).toString()
      },
    };
    await collectionObj.updateOne({ _id: metric._id }, updateDoc);
  } finally {
    await client.close();
  }
}

module.exports = {
  init,
  updateMetrics
}
