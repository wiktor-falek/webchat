import dotenv from 'dotenv'; dotenv.config();


export default function messageIsValid(message) {
    if (
        message.length > process.env.MESSAGE_MAXLEN
        ) {
        return false;
    }
    return true;
}