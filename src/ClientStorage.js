import { v4 as uuidv4 } from 'uuid';

import validateUUID from './utils/validateUUID.js';
import logger from "./logger.js";
import Client from "./Client.js";

class ClientStorage {
    #clients = {};

    addClient(name, socketId, color, clientId=undefined) {
        // instantiates and returns a new client with unique id
        let id = validateUUID(clientId) || uuidv4();
        const client = new Client(id, socketId, name, color);
        this.#clients[id] = client;
        return client;
        logger.debug(`Client(${client.name}, ${client.id}) added to ClientStorage`);
    }

    removeClient(client) {
        delete this.#clients[client.id];
        logger.debug(`Client(${client.name}, ${client.id}) removed from ClientStorage`);
    }

    getClientById(id) {
        return this.#clients[id];
    }

    getClientBySocketId(socketId) {
        for (let client of this.#all) {
            if (client.socketId === socketId) {
                return client;
            }
        }
        return null;
    }

    logClients() {
        console.log(this.#all);
    }
    
    get #all() {
        return Object.values(this.#clients);
    }

    get allClientsPublicProperties() {
        // returns an array of publicProperties object of each client
        return this.#all.map((client) => {
            return client.publicProperties;
        })
    }
}

export default new ClientStorage();