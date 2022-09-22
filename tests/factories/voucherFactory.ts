import { faker } from '@faker-js/faker';

export async function voucherBody() {
    return {
        code: faker.random.alphaNumeric(10),
        discount: Number(faker.commerce.price(1, 100))
    }
}

export async function voucherData() {
    return {
        id: Number(faker.commerce.price(1, 100)),
        code: faker.random.alphaNumeric(10),
        discount: Number(faker.commerce.price(1, 100, 0)),
        used: false
    }
}

export async function amountBiggerThan100() {
    return Number(faker.commerce.price(101, 500));
}

export async function usedVoucherData() {
    return {
        id: Number(faker.commerce.price(1, 100)),
        code: faker.random.alphaNumeric(10),
        discount: Number(faker.commerce.price(1, 100, 0)),
        used: true
    }
}

export async function amountLowerThan100() {
    return Number(faker.commerce.price(1, 100));
}

