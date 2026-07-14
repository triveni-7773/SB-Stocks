const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://vedaangarapu_db_user:Veda120707@cluster0.cgrydg2.mongodb.net/SB-Stocks?retryWrites=true&w=majority&appName=Cluster0";

async function test() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected successfully!");
    await client.close();
  } catch (err) {
    console.error(err);
  }
}

test();