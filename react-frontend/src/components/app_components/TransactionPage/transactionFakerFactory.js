
import { faker } from "@faker-js/faker";
export default (user,count,branchIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
date: faker.lorem.sentence(1),
reference: faker.lorem.sentence(1),
description: faker.lorem.sentence(1),
branchId: branchIdIds[i % branchIdIds.length],
accountId: faker.lorem.sentence(1),
modelType: faker.lorem.sentence(1),
modelId: faker.lorem.sentence(1),
type: faker.lorem.sentence(1),
debit: faker.lorem.sentence(1),
credit: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
