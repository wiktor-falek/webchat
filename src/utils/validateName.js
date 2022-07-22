import dotenv from 'dotenv'; dotenv.config();

function validateName(oldName) {
    let name = oldName.trim();
    if (
        name !== undefined &&
        name !== null &&
        name !== "" &&
        name.length <= process.env.MESSAGE_MAXLEN || 32 &&
        name.toUpperCase() !== "[SERVER]"
        ) {
            return name.replace(/\n|\r/g, ""); // remove \n
        }
    return null;
}

export default validateName;