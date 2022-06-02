import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import express, { json, urlencoded } from "express";
import dotenv from "dotenv"; dotenv.config();
import cors from "cors";
import path from "path";

import logger from "./logger.js";


// initialize express
const app = express();

app.use(cors());

// express config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'static'), { extensions: ['html']}));

const server = app.listen(process.env.PORT || 3000, () => {
    logger.info(`listening on port ${server.address().port}`);
});