import { validate as uuidValidate } from 'uuid';
import { version as uuidVersion } from 'uuid';

export default function uuidIsValid(id) {
    return uuidValidate(id) && uuidVersion(id) === 4;
}