import dotenv from "dotenv"; dotenv.config();

export default function messageIsValid(message) {
    if (
        message.length > dotenv.MESSAGE_MAXLEN 
        ) {
        return false;
    }
    return true;
}