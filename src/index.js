import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import express, { json, urlencoded } from "express";
import http from "http";
import { Server } from 'socket.io';
import dotenv from "dotenv"; dotenv.config();
import cors from "cors";
import path from "path";

import logger from "./logger.js";
import Client from './Client.js';
import ClientHandler from './ClientHandler.js';
import generateJoinMessage from './generateJoinMessage.js';

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
    const username = socket.request._query['username'];
    logger.info(`user '${username}' connected`);

    const client = new Client(username);
    ClientHandler.add(client);
    
    socket.emit('online', ClientHandler.onlineUsers);

    socket.broadcast.emit('connection', generateJoinMessage(username));

    socket.on("disconnect", () => {
        ClientHandler.remove(client);
        logger.info(`user '${username}' disconnected`);
        socket.broadcast.emit('leave', username);
    });
    socket.on("message", (data) => {
        logger.info(`${data.author}: '${data.content}'`);
        io.emit('message', data);
    })
});

server.listen(process.env.PORT || 3000, () => {
    logger.info(`listening on port ${server.address().port}`);
});