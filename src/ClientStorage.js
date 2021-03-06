import { v4 as uuidv4 } from 'uuid';

import validateUUID from './utils/validateUUID.js';
import logger from "./logger.js";
import Client from "./Client.js";


class ClientStorage {
    constructor() {
        this.clients = {};
    }
    addClient(name, socketId, color, clientId=undefined) {
        // instantiates and returns a new client with unique id
        let id = validateUUID(clientId) || uuidv4();
        const client = new Client(id, socketId, name, color);
        this.clients[id] = client;
        return client;
    }

    removeClient(client) {
        delete this.clients[client.id];
        logger.debug(`removed from ClientStorage Client(${client.name}, ${client.id})`);
    }

    getClientById(id) {
        return this.clients[id];
    }

    getClientBySocketId(socketId) {
        for (let client of this.all) {
            if (client.socketId === socketId) {
                return client;
            }
        }
        return null;
    }

    get all() {
        // returns an array of all Client objects
        return Object.values(this.clients);
    }
}

export default new ClientStorage();