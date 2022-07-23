import dotenv from "dotenv"; dotenv.config();

import logger from "../logger.js";
import ClientStorage from "../ClientStorage.js";


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
                    "/help            - display this message\n" +
                    "/ping            - ping the server\n" +
                    "/clear           - clear screen\n" +
                    "/nick \`new_nick\` - change nickname",
                    name: process.env.SERVER_NAME,
                    color: process.env.SERVER_COLOR,
                    timestamp: Date.now()
                })
                return;
            case "ping":
                socket.emit('message', {
                    content: "pong",
                    name: process.env.SERVER_NAME,
                    color: process.env.SERVER_COLOR,
                    timestamp: Date.now()
                })
                return;
            case "nick":
                const client = ClientStorage.getClientBySocketId(socket.id)
                if (!client) {
                    return;
                }
                const oldName = client.name;
                const newName = client.setName(args.join(" "));

                if (!newName) {
                    const NAME_MAXLEN = process.env.NAME_MAXLEN || "32";
                    socket.emit('message', {
                        // content: `Couldn't change nickname, ${errorMsg}`,
                        content: `Couldn't change nickname\nTry something else\nKeep in mind nickname length is limted to ${NAME_MAXLEN}`,
                        name: process.env.SERVER_NAME,
                        color: process.env.SERVER_COLOR,
                        timestamp: Date.now()
                    })
                    return;
                }
                io.emit('onlineUsers', ClientStorage.all);

                socket.emit('nameChange', newName);

                socket.emit('message', {
                    content: `Your nickname has been changed to ${newName}`,
                    name: process.env.SERVER_NAME,
                    color: process.env.SERVER_COLOR,
                    timestamp: Date.now()
                })

                socket.broadcast.emit('message', {
                    content: `${oldName} set nickname to ${newName}`,
                    name: process.env.SERVER_NAME,
                    color: process.env.SERVER_COLOR,
                    timestamp: Date.now()
                })
                return;

                // template
                socket.emit('message', {
                    content: "",
                    name: process.env.SERVER_NAME,
                    color: process.env.SERVER_COLOR,
                    timestamp: Date.now()
                })
                return;
            default:
                socket.emit('message', {
                    content: `Invalid command '${message}'\nType /help for list of commands`,
                    name: process.env.SERVER_NAME,
                    color: process.env.SERVER_COLOR,
                    timestamp: Date.now()
                });
                return;
        }
    }
    catch (e) {
        logger.error(`executeCommand exception: ${e}`);
    }
}

