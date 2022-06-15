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
import ClientStorage from './ClientStorage.js';
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
    const client = ClientStorage.addClient(name, color);
    logger.info(`Client(${client.name}, ${client.uuid}) connected`);

    socket.emit('uuid', { uuid: client.uuid }); // send generated uuid to client

    socket.broadcast.emit('connection', {
        name: client.name,
        color: client.color,
        joinMessage: generateJoinMessage()
    });

    io.emit('online',
        ClientStorage.allClients
        .map(client => {
            return {
                name: client.name,
                color: client.color
            }
        })
    );

    socket.on("disconnect", () => {
        ClientStorage.removeClient(client);
        logger.info(`Client(${client.name}, ${client.uuid}) disconnected`);
        socket.broadcast.emit('leave', { name: name });
    });

    socket.on("message", (data) => {
        const uuid = data.uuid;
        const client = ClientStorage.getClient(uuid);
        io.emit('message', {
            content: data.content,
            name: client.name,
            color: client.color
        });
        logger.info(`Client(${client.name}, ${client.uuid}) said: '${data.content}'`)
    })

    socket.on("colorChange", (data) => {
        console.log(data);
        const uuid = data.uuid;
        const color = data.color;
        const client = ClientStorage.getClient(uuid);
        client.setColor(color);
        console.log(client.color);
    })
});

server.listen(process.env.PORT || 3000, () => {
    logger.info(`listening on port ${server.address().port}`);
});