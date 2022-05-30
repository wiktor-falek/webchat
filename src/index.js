import express, { json, urlencoded } from "express";
import pkg from "pg"; const { Pool, Client } = pkg;
import dotenv from "dotenv"; dotenv.config();
import cors from "cors";

import logger from "./logger.js";


const app = express();
const dbClient = new Client();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGHOST,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
})

