import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import express, { json, urlencoded } from "express";
import http from "http";
import { Server } from 'socket.io';
import dotenv from "dotenv"; dotenv.config();
import cors from "cors";
import path from "path";

import logger from "./logger.js";


// express
const app = express();

app.use(cors());

// express config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'static'), { extensions: ['html']}));

// socket.io
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    logger.info("user connected");
    socket.on("disconnect", () => {
        logger.info("user disconnected");
    });
});

server.listen(process.env.PORT || 3000, () => {
    logger.info(`listening on port ${server.address().port}`);
});