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
import ClientManager from './ClientManager.js';
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
    const query = socket.request._query;
    const name = query['name'];
    const color = query['color'];
    console.log(color)
    logger.info(`user '${name}' connected`);

    const client = ClientManager.addClient(name, color);
    ClientManager.logClients();

    socket.broadcast.emit('connection', {
        name: client.name,
        color: client.color,
        joinMessage: generateJoinMessage()
    });

    io.emit('online', ClientManager.clients);

    socket.on("disconnect", () => {
        ClientManager.removeClient(client);
        logger.info(`user '${name}' disconnected`);
        socket.broadcast.emit('leave', { name: name });
    });
    socket.on("message", (data) => {
        logger.info(`${data.author}: '${data.content}'`);
        io.emit('message', data);
    })
    socket.on("colorChange", (data) => {
        logger.debug(`data for colorChange: ${data}`)
    })
});

server.listen(process.env.PORT || 3000, () => {
    logger.info(`listening on port ${server.address().port}`);
});