import logger from "./logger.js";
import Client from "./Client.js";

class ClientHandler {
    constructor() {
        this._id = 0;
        this.onlineUsers = {};
    }
    add(username) {
        // returns a new client with unique id
        const client = new Client(username, this._id)
        this.onlineUsers[client.id] = client;
        this._id += 1;
        logger.debug(`added client ${client.name}:${client.id}`);
        return client;
    }
    remove(client) {
        delete this.onlineUsers[client.id];
        logger.debug(`removed client ${client.name}:${client.id}`);
    }
    logClients() {
        console.log(this.onlineUsers);
    }
}

export default new ClientHandler();