
import { faker } from "@faker-js/faker";
export default (user,count,branchIdIds,categoryIdIds,unitIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
branchId: branchIdIds[i % branchIdIds.length],
sku: faker.lorem.sentence(1),
name: faker.lorem.sentence(1),
type: faker.lorem.sentence(1),
categoryId: categoryIdIds[i % categoryIdIds.length],
unitId: unitIdIds[i % unitIdIds.length],
stockQuantity: faker.lorem.sentence(1),
description: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
