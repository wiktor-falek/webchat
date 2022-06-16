import logger from "../logger.js";


const allJoinMessages = [
    "{{name}} has joined!",
    "{{name}} just arrived!",
    "{{name}} joined the party!",
    "{{name}} just landed!",
    "{{name}} showed up!",
    "Look, {{name}} is here!",
    "Is it a bird? Is it a plane? No it's {{name}}!",
]

function generateJoinMessage() {
    let joinMessage;
    try {
        joinMessage = allJoinMessages[Math.floor(Math.random() * allJoinMessages.length)];
    }
    catch(err) {
        logger.warn(`failed to generate random join message, ${err.message}`);
        joinMessage = "{{name}} has joined!"; //default
    }
    return joinMessage;
}

export default generateJoinMessage;