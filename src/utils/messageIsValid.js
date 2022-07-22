import dotenv from "dotenv"; dotenv.config();

function messageIsValid(message) {
    if (
        message.length <= process.env.MESSAGE_MAXLEN
    ) {
        return true;
    }
    return false;
}

export default messageIsValid;