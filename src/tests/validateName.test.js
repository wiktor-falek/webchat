import dotenv from 'dotenv'; dotenv.config();

import validateName from "../utils/validateName";

const NAME_MAXLEN = parseInt(process.env.NAME_MAXLEN);

describe("Name Validation Test", () => {
    test(`name that is longer than ${NAME_MAXLEN} should return null`, () => {
        expect(validateName("[SERVER]"))
        .toBe(null);
        
        expect(validateName("*".repeat(NAME_MAXLEN + 1)))
        .toBe(null);

        expect(validateName("*".repeat(NAME_MAXLEN)))
        .toBe("*".repeat(NAME_MAXLEN));

        expect(validateName(""))
        .toBe(null)

        expect(validateName(" "))
        .toBe(null)

        expect(validateName(undefined))
        .toBe(null)
    })
})