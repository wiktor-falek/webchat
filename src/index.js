import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
import express, { json, urlencoded } from "express";
import http from "http";
import { Server } from 'socket.io';
import dotenv from "dotenv"; dotenv.config();
import cors from "cors";
import path from "path";

import logger from "./logger.js";
import ClientStorage from './ClientStorage.js';
import generateJoinMessage from './utils/generateJoinMessage.js';
import validateUUID from './utils/validateUUID.js';
import messageIsValid from './utils/messageIsValid.js';
import executeCommand from './helpers/executeCommand.js';


// express
const app = express();

app.use(cors({
    origin: "*"
}));

app.use(express.static(path.join(__dirname, 'static'), { extensions: ['html']}));

// socket.io
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    const query = socket.request._query;
    const name = query['name'];
    const color = query['color'];
    const clientId = validateUUID(query['id']);

    const client = ClientStorage.addClient(name, socket.id, color, clientId);
    logger.info(`connected Client(${client.name}, ${client.id})`);

    socket.emit('id', { id: client.id }); // send generated id to client
    logger.debug(`emitted id ${client.id}`);

    socket.broadcast.emit('connection', {
        name: client.name,
        color: client.color,
        joinMessage: generateJoinMessage(),
        timestamp: Date.now()
    });


    io.emit('online', ClientStorage.all);

    socket.on("disconnect", () => {
        ClientStorage.removeClient(client);
        logger.info(`disconnected Client(${client.name}, ${client.id})`);
        socket.broadcast.emit('leave', {
            name: name,
            color: client.color,
            timestamp: Date.now()
        });
    });

    socket.on("message", (data) => {
        const message = data.content;
        const id = validateUUID(data.id);
        if (id === undefined) {
            logger.warn(`Invalid id provided '${id}'`);
            return;
        } 

        if (!messageIsValid(message)) {
            return socket.emit('message', {
                content: "Illegal message, you're going to jail",
                name: "[SERVER]",
                color: "#C41E3A",
                timestamp: Date.now()
            })
        }
        
        if (message.startsWith('/')) {
            return executeCommand(socket, message);
        }
        
        try {
            const client = ClientStorage.getClientById(id);
            io.emit('message', {
                content: data.content,
                name: client.name,
                color: client.color,
                timestamp: Date.now()
            });
            logger.info(`Client(${client.name}, ${client.id}) said: '${data.content}'`)
        }
        catch {
            logger.debug(`Could not get client with id ${id}`)
        }
    })

    socket.on("privateMessage", (data) => {
        const message = data.content;
        if (!messageIsValid(message)) {
            return;
        }

        socket.to(data.socketId).emit('message', {
            content: `${message}`,
            name: `@From ${data.author}`,
            color: `#66B2FF`,
            timestamp: Date.now()
        }); 

        const recipientName = ClientStorage.getClientBySocketId(data.socketId).name;
        socket.emit('message', {
            content: `${message}`,
            name: `@To ${recipientName}`,
            color: "#66B2FF",
            timestamp: Date.now()
        });
        return;
    })

    socket.on("colorChange", (data) => {
        const id = data.id;
        const color = data.color;
        const client = ClientStorage.getClientById(id);
        client.setColor(color);
    })
});

server.listen(process.env.PORT || 3000, () => {
    logger.info(`listening on port ${server.address().port}`);
});