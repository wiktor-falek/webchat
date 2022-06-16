import logger from "../logger.js";


export default function executeCommand(socket, message) {
    const params = message.trim().slice(1).split(" ");
    const command = params[0];
    const args = params.slice(1);

    try {
        switch (command) {
            case "help":
            case "h":
                socket.emit('message', {
                    content: "\n/help - displays this message \n/test - test",
                    name: "[SERVER]",
                    color: "#C41E3A",
                    timestamp: Date.now()
                })
                return;
            default:
                socket.emit('message', {
                    content: `Invalid command '${message}'`,
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

