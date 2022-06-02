import winston from 'winston';
import {format} from 'winston';

import dotenv from "dotenv"; dotenv.config();


const tsFormat = () => ( new Date() ).toLocaleDateString() + ' - ' + ( new Date() ).toLocaleTimeString();

const logger = winston.createLogger({
    level: process.env.LEVEL || "info",
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json()
    ),
    transports: [
        new ( winston.transports.Console )({ 
            timestamp: tsFormat,
            colorize: false,
        }),
        new winston.transports.File({ filename: 'combined.log'})
    ]
});

export default logger;