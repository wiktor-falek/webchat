import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
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
import uuidIsValid from './utils/uuidIsValid.js';
import messageIsValid from './utils/messageIsValid.js';
import executeCommand from './helpers/executeCommand.js';

// express
const app = express();

app.use(cors({
    origin: "*"
}));

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
    let clientId = query['id'];
    if (clientId != 'null' || clientId != 'undefined') { // could uuid validate
        logger.debug(`received id ${clientId}`);
    }

    const client = ClientStorage.addClient(name, color, clientId);
    logger.info(`Client(${client.name}, ${client.id}) connected`);

    socket.emit('id', { id: client.id }); // send generated id to client
    logger.debug(`emitted id ${client.id}`);

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
        logger.info(`Client(${client.name}, ${client.id}) disconnected`);
        socket.broadcast.emit('leave', { name: name, color: client.color});
    });

    socket.on("message", (data) => {
        const message = data.content;
        const id = data.id; 

        if (!messageIsValid(message)) {
            return socket.emit('message', {
                content: "Illegal message, you're going to jail",
                name: "[SERVER]",
                color: "#C41E3A"
            })
        }

        if (!uuidIsValid(id)) {
            logger.warn(`Invalid id provided '${id}'`);
            return;
        }
        
        if (message.startsWith('/')) {
            return executeCommand(socket, message);
        }
        
        try {
            const client = ClientStorage.getClient(id);
            io.emit('message', {
                content: data.content,
                name: client.name,
                color: client.color
            });
            logger.info(`Client(${client.name}, ${client.id}) said: '${data.content}'`)
        }
        catch {
            logger.debug(`Could not get client with id ${id}`)
        }
    })

    socket.on("colorChange", (data) => {
        console.log(data);
        const id = data.id;
        const color = data.color;
        const client = ClientStorage.getClient(id);
        client.setColor(color);
        console.log(client.color);
    })
});

server.listen(process.env.PORT || 3000, () => {
    logger.info(`listening on port ${server.address().port}`);
});