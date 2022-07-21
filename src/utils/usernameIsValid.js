import dotenv from 'dotenv'; dotenv.config();

function validateName(name) {
    if (
        name !== undefined &&
        name !== null &&
        name !== "null" && 
        name !== "undefined" &&
        name.toUpperCase() !== "[SERVER]"
        ) {
            return name.trim();
        }
    return undefined;
}

export default validateName;