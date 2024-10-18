
import { faker } from "@faker-js/faker";
export default (user,count,branchIdIds,purchaseIdIds,productIdIds,variationIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
branchId: branchIdIds[i % branchIdIds.length],
purchaseId: purchaseIdIds[i % purchaseIdIds.length],
productId: productIdIds[i % productIdIds.length],
variationId: variationIdIds[i % variationIdIds.length],
quantity: faker.lorem.sentence(1),
price: faker.lorem.sentence(1),
tax: faker.lorem.sentence(1),
discount: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
