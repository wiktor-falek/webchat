import logger from "../logger.js";

import ClientStorage from "../ClientStorage.js";

/*
RESPONSE BOILERPLATE

case "":
    socket.emit('message', {
        content: "",
        name: "[SERVER]",
        color: "#C41E3A",
        timestamp: Date.now()
    })
    return;



*/


export default function executeCommand(socket, io, message) {
    const params = message.trim().slice(1).split(" ");
    const command = params[0];
    const args = params.slice(1);

    try {
        switch (command) {
            case "help":
            case "h":
                socket.emit('message', {
                    content: 
                    "List of available commands:\n" +
                    "/help  - display this message\n" +
                    "/ping  - ping the server\n" +
                    "/clear - clear screen\n" +
                    "/nick \`new_nick\`",
                    name: "[SERVER]",
                    color: "#C41E3A",
                    timestamp: Date.now()
                })
                return;
            case "ping":
                socket.emit('message', {
                    content: "pong",
                    name: "[SERVER]",
                    color: "#C41E3A",
                    timestamp: Date.now()
                })
                return;
            case "nick":
                const client = ClientStorage.getClientBySocketId(socket.id)
                if (!client) {
                    return;
                }
                console.log(client)
                const newName = args[0];
                client.setName(newName);
                socket.emit('message', {
                    content: `Your nickname has been changed to ${newName}`,
                    name: "[SERVER]",
                    color: "#C41E3A",
                    timestamp: Date.now()
                })
                io.emit('onlineUsers', ClientStorage.all);
                return;

                // template
                socket.emit('message', {
                    content: "",
                    name: "[SERVER]",
                    color: "#C41E3A",
                    timestamp: Date.now()
                })
                return;
            default:
                socket.emit('message', {
                    content: `Invalid command '${message}'\nType /help for list of commands`,
                    name: "[SERVER]",
                    color: "#C41E3A",
                    timestamp: Date.now()
                });
                return;
        }
    }
    catch (e) {
        logger.error(`parseCommand exception: ${e}`);
    }
}

