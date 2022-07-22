import dotenv from 'dotenv'; dotenv.config();

function validateName(name) {
    name = name.trim();
    if (
        name !== undefined &&
        name !== null &&
        name !== "null" && 
        name !== "undefined" &&
        name !== "" &&
        name !== " " &&
        name.length <= process.env.MESSAGE_MAXLEN || 32 &&
        name.toUpperCase() !== "[SERVER]"
        ) {
            return name;
        }
    return undefined;
}

export default validateName;