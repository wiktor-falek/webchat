import { validate as uuidValidate } from 'uuid';
import { version as uuidVersion } from 'uuid';
import logger from '../logger.js';

/**
 * 
 * @param {string} id 
 * @returns id if validated or undefined
 * 
 * example use:
 * let id = validateUUID(clientId) || uuidv4();
 */
export default function validateUUID(id) {
    if (uuidValidate(id) && uuidVersion(id) === 4) {
        logger.debug(`valid uuid provided ${id}`);
        return id;
    }
    logger.debug(`invalid uuid ${id}`);
    return undefined;
}