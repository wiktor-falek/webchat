import logger from "./logger";

class Client {
    constructor(name, id) {
        this.name = name;
        this.id = id;
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
}

export default Client;