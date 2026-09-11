import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongoDb } from "./Utils/mongodb.js";
import URLRoute from "./Routes/urls.js";

import dns from "dns/promises";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

connectMongoDb();

app.use("/", URLRoute);

app.listen(5050, () => {
  console.log("Server is running on port 5050");
});