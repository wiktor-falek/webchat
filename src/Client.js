import logger from "./logger.js";


class Client {
    #id;
    constructor(id, socketId, name, color) {
        this.#id = id;
        this.socketId = socketId;
        this.name = name;
        this.color = undefined;
        logger.debug(`created Client(${this.name}, ${this.#id})`);
        this.setColor(color);
    }

    get id() {
        return this.#id;
    }

    setColor(hexString) {
        const regex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
        if (regex.test(hexString)) {
            this.color = hexString;
            logger.debug(`Client(${this.name}, ${this.id}) set color to ${hexString}`);        
        }
        else {
            logger.debug(`failed to change color, invalid hexString:${hexString}`);
        }
    }
    isVerified(name, id) {
        return (name == this.name && id == this.id);
    }

}

export default Client;