import { validate as uuidValidate } from 'uuid';
import { version as uuidVersion } from 'uuid';

export default function validateUUID(id) {
    // example use:
    // let id = validateUUID(clientId) || uuidv4();
    if (uuidValidate(id) && uuidVersion(id) === 4) {
        return id;
    }
    return undefined;
}