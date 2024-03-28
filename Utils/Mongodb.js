import { MongoClient } from "mongodb";
require("dotenv").config();
let client;
const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DATABASE;
const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
  }
  return client;
};

export async function toDoList() {
  const databaseClient = await connectToDatabase();
  return databaseClient.db(DB_NAME).collection("table");
}
