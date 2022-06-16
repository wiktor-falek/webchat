import logger from "../logger.js";


const allJoinMessages = [
    "{{name}} just arrived!",
    "{{name}} has joined!",
    "{{name}} joined the party!",
    "{{name}} just landed!",
    "{{name}} showed up!",
    "Look, {{name}} is here",
    "Is it a bird? Is it a plane? No it's {{name}}!",
    "Welcome {{name}}! Stay awhile and listen."
]

function generateJoinMessage() {
    let joinMessage;
    try {
        joinMessage = allJoinMessages[Math.floor(Math.random() * allJoinMessages.length)];
    }
    catch(err) {
        logger.error(`failed to generate random join message, ${err.message}`);
        joinMessage = "{{name}} joined."; //default
    }
    return joinMessage;
}

export default generateJoinMessage;