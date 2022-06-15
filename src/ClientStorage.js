import { v4 as uuidv4 } from 'uuid';
import uuidIsValid from './utils/uuidIsValid.js';

import logger from "./logger.js";
import Client from "./Client.js";

class ClientStorage {
    #clients = {};

    addClient(name, color, clientId=undefined) {
        // instantiates and returns a new client with unique id
        let id = uuidv4();
        if (uuidIsValid(clientId)) {
            logger.debug(`Client(${name, clientId}) provided his id`)
            id = clientId; // if validated set id to uuid provided by client
        }
        const client = new Client(id, name, color)
        this.#clients[id] = client;
        return client;
    }

    removeClient(client) {
        delete this.#clients[client.id];
        logger.debug(`Client(${client.name}, ${client.id}) removed`);
    }

    getClient(id) {
        return this.#clients[id];
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