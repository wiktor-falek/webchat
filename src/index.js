import express, { json, urlencoded } from "express";
import dotenv from "dotenv"; dotenv.config();
import cors from "cors";

import logger from "./logger.js";


const app = express();

const server = app.listen(process.env.PORT || 3000, () => {
    logger.info(`listening on port ${server.address().port}`);
});