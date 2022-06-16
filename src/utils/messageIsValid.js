export default function messageIsValid(message) {
    if (
        message.length > 256
        ) {
        return false;
    }
    return true;
}