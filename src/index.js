import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from 'socket.io';
import dotenv from "dotenv"; dotenv.config();

import logger from "./logger.js";
import ClientStorage from './ClientStorage.js';
import executeCommand from './helpers/executeCommand.js';
import generateJoinMessage from './utils/generateJoinMessage.js';
import validateUUID from './utils/validateUUID.js';
import messageIsValid from './utils/messageIsValid.js';


const SERVER_COLOR = "#C41E3A";

// express
const app = express();

app.use(cors({origin: '*'}));

// socket.io
const server = createServer();
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      //allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

io.on("connection", (socket) => {
    const query = socket.request._query;
    const name = query['name'] || "Anonymous";
    const color = query['color'];
    const clientId = validateUUID(query['id']);
    logger.info(`Client provided clientId ${clientId}`)

    const client = ClientStorage.addClient(name, socket.id, color, clientId);
    logger.info(`connected Client(${client.name}, ${client.id})`);

    socket.emit('id', client.id);

    socket.broadcast.emit('userJoin', {
        name: "[SERVER]",
        color: SERVER_COLOR,
        who: client.name,
        socketId: client.socketId,
        joinMessage: generateJoinMessage(),
        timestamp: Date.now()
    });

    io.emit('onlineUsers', ClientStorage.all);

    socket.on("disconnect", () => {
        ClientStorage.removeClient(client);
        socket.broadcast.emit('userLeave', {
            name: client.name,
            socketId: client.socketId,
            color: client.color,
            timestamp: Date.now()
        });
        io.emit('onlineUsers', ClientStorage.all);
        logger.info(`disconnected Client(${client.name}, ${client.id})`);
    });

    socket.on("message", (data) => {
        const message = data.content;
        const id = validateUUID(data.id);
        if (id === undefined) {
            logger.warn(`Message rejected due to invalid id '${id}'`);
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
        
        io.emit('message', {
            name: client.name,
            content: data.content,
            color: client.color,
            timestamp: Date.now()
        });
        logger.info(`Client(${client.name}, ${client.id}) said: '${data.content}'`)

    })

    socket.on("privateMessage", (data) => {
        const message = data.content;
        const target = ClientStorage.getClientBySocketId(data.targetId);
        console.log(target)
        if (!target) {
            return socket.emit('message', {
                content: `${data.targetId} doesn't exist`,
                name: "[SERVER]",
                color: "#C41E3A",
                timestamp: Date.now()
            })
        }
        
        socket.emit('message', {
            content: `${message}`,
            name: `@To ${target.name}`,
            color: "#66B2FF",
            timestamp: Date.now()
        });
        
        socket.to(data.targetId).emit('message', 
        {
            content: `${message}`,
            name: `@From ${client.name}`,
            color: `#66B2FF`,
            timestamp: Date.now()
        }); 

        if (data.targetId == socket.id) {
            socket.emit('message', {
                content: `${message}`,
                name: `@From ${client.name}`,
                color: `#66B2FF`,
                timestamp: Date.now()
            })
        }
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