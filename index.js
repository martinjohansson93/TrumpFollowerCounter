import express from "express";
import { getTwitterCount, getInstragramCount } from "./lib/scraper";
import lowdb from "lowdb";
import fileSync from "lowdb/adapters/FileSync";

const adapter = new fileSync("db.json");
const db = lowdb(adapter);
const app = express();
db.defaults({ twitter: [], instagram: [] }).write();

app.get("/scrape", async (req, res, next) => {
  const [twitterFollowers, instagramFollowers] = await Promise.all([
    getTwitterCount(db),
    getInstragramCount(db)
  ]);
  db.get("twitter")
    .push({
      date: Date.now(),
      count: twitterFollowers
    })
    .write();
  db.get("instagram")
    .push({
      date: Date.now(),
      count: instagramFollowers
    })
    .write();

  res.json({ twitterFollowers, instagramFollowers });
});

const server = app.listen(3080, () => {
  console.log(`App running on ${server.address().port}`);
});
