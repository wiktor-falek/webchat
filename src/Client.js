import logger from "./logger.js";

class Client {    
    constructor(name, id) {
        this.id = id;
        this.name = name;
        this.color = "#111111";
    }
    changeColor(hexString) {
        if (hexString.test("^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$")) {
            this.color = hexString;
            logger.debug(`Client(${this.name}, ${this.id}) changed color to ${hexString}`);        
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