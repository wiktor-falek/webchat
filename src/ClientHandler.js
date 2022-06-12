import { v4 as uuidv4 } from 'uuid';

import logger from "./logger.js";
import Client from "./Client.js";

class ClientHandler {
    #clients = {};

    add(username) {
        // instantiates and returns a new client with unique id
        const id = uuidv4();
        const client = new Client(username, id)
        this.#clients[id] = client;
        logger.debug(`added client ${client.name} [${client.id}]`);
        return client;
    }
    remove(client) {
        delete this.#clients[client.id];
        logger.debug(`removed client ${client.name}:${client.id}`);
    }
    logClients() {
        console.log(this.#clients);
    }
    get #all() {
        return Object.values(this.#clients);
    }
    get clients() {
        // returns an array of publicProperties object of each client
        return this.#all.map((client) => {
            return client.publicProperties;
        })
    }
}

export default new ClientHandler();