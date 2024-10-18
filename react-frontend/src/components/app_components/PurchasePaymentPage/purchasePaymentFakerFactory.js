
import { faker } from "@faker-js/faker";
export default (user,count,branchIdIds,purchaseIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
branchId: branchIdIds[i % branchIdIds.length],
purchaseId: purchaseIdIds[i % purchaseIdIds.length],
date: faker.lorem.sentence(1),
amount: faker.lorem.sentence(1),
accountId: faker.lorem.sentence(1),
paymentMethod: faker.lorem.sentence(1),
reference: faker.lorem.sentence(1),
description: faker.lorem.sentence(1),
receiptPath: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
