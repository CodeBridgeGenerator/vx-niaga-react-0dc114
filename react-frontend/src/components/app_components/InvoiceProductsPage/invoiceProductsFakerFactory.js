
import { faker } from "@faker-js/faker";
export default (user,count,invoiceIdIds,productIdIds,variationIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
invoiceId: invoiceIdIds[i % invoiceIdIds.length],
productId: productIdIds[i % productIdIds.length],
variationId: variationIdIds[i % variationIdIds.length],
quantity: faker.lorem.sentence(""),
price: faker.lorem.sentence(""),
tax: faker.lorem.sentence(""),
discount: faker.lorem.sentence(""),
description: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
