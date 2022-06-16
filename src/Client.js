import logger from "./logger.js";

class Client {    
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = undefined;
        logger.debug(`Client(${this.name}, ${this.id}) added`);
        this.setColor(color);
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
    get publicProperties() {
        return {
            name: this.name,
            color: this.color
        }
    }
}

export default Client;