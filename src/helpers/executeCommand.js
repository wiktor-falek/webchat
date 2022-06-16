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
                    content: `You used /h command`,
                    name: "[SERVER]",
                    color: "#C41E3A",
                    timestamp: Date.now()
                })
                return;
            case "w": 
                let content = args.join(" ");
                console.log(content)
                socket.to().emit('message', {
                    content: `${content}`, // temporary solution
                    name: `@From Sender`, // template literal Sender
                    color: "#66B2FF",
                    timestamp: Date.now()
                });
                socket.emit('message', {
                    content: `${message}`,
                    name: `@To ${args[0]}`,
                    color: "#66B2FF",
                    timestamp: Date.now()
                });
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

