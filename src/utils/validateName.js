import dotenv from 'dotenv'; dotenv.config();

function validateName(oldName) {
    if (oldName === undefined || oldName === null) {
        return null;
    }
    
    let name = oldName.trim();
    if (
        name !== undefined &&
        name !== null &&
        name !== "" &&
        name.length <= (process.env.NAME_MAXLEN || 32) &&
        name.toUpperCase() !== "[SERVER]"
        ) {
            return name.replace(/\n|\r/g, ""); // remove \n
        }
    return null;
}

export default validateName;