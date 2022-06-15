import logger from "./logger.js";

class Client {    
    constructor(uuid, name, color) {
        this.uuid = uuid;
        this.name = name;
        this.color = undefined;
        logger.debug(`Client(${this.name}, ${this.uuid}) added`);
        this.setColor(color);
    }
    setColor(hexString) {
        const regex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
        if (regex.test(hexString)) {
            this.color = hexString;
            logger.debug(`Client(${this.name}, ${this.uuid}) set color to ${hexString}`);        
        }
        else {
            logger.debug(`failed to change color, invalid hexString:${hexString}`);
        }
    }
    isVerified(name, uuid) {
        return (name == this.name && uuid == this.uuid);
    }
    get publicProperties() {
        return {
            name: this.name,
            color: this.color
        }
    }
}

export default Client;