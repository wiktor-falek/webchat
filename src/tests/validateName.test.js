import dotenv from 'dotenv'; dotenv.config();

import validateName from "../utils/validateName";

const NAME_MAXLEN = parseInt(process.env.NAME_MAXLEN);

describe("Name Validation Test", () => {
    test(`length should be less than or equal to ${NAME_MAXLEN}`, () => {
        expect(validateName("*".repeat(NAME_MAXLEN + 1)))
        .toBe(null);

        expect(validateName("*".repeat(NAME_MAXLEN)))
        .toBe("*".repeat(NAME_MAXLEN));
    });

    test("empty strings", () => {
        expect(validateName(""))
        .toBe(null);

        expect(validateName(" "))
        .toBe(null);
    });

    test("reserved names should return null", () => {
        expect(validateName(process.env.SERVER_NAME))
        .toBe(null);
    });

    test("name is not a string", () => {
        expect(validateName(undefined))
        .toBe(null);
        expect(validateName(null))
        .toBe(null);
    });
});