import { v4 as uuidv4 } from 'uuid';

import logger from "./logger.js";
import Client from "./Client.js";

class ClientStorage {
    #clients = {};

    addClient(name, color) {
        // instantiates and returns a new client with unique id
        const uuid = uuidv4();
        const client = new Client(uuid, name, color)
        this.#clients[uuid] = client;
        return client;
    }

    removeClient(client) {
        delete this.#clients[client.uuid];
        logger.debug(`client(${this.name}, ${this.uuid}) removed`);
    }

    getClient(uuid) {
        return this.#clients[uuid];
    }

    logClients() {
        console.log(this.#all);
    }
    
    get #all() {
        return Object.values(this.#clients);
    }

    get allClients() {
        // returns an array of publicProperties object of each client
        return this.#all.map((client) => {
            return client.publicProperties;
        })
    }
}

export default new ClientStorage();