import logger from "./logger.js";


const allJoinMessages = [
    "{{username}} just arrived!",
    "{{username}} has joined!",
    "{{username}} joined the party!",
    "{{username}} just landed!",
    "{{username}} showed up!",
    "Look, {{username}} is here",
    "Is it a bird? Is it a plane? No it's {{username}}!",
    "Welcome {{username}}! Stay awhile and listen."
]

const generateJoinMessage = (username) => {
    let randomMessage;
    try {
        randomMessage = allJoinMessages[Math.floor(Math.random() * allJoinMessages.length)];
    }
    catch(err) {
        logger.error(`failed to generate random join message, ${err.message}`);
        randomMessage = "# joined."; //default
    }
    return {"username": username, "message": randomMessage};
}

export default generateJoinMessage;