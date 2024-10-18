
import { faker } from "@faker-js/faker";
export default (user,count,branchIdIds,productIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
branchId: branchIdIds[i % branchIdIds.length],
productId: productIdIds[i % productIdIds.length],
name: faker.lorem.sentence(1),
subSku: faker.lorem.sentence(1),
purchasePrice: faker.lorem.sentence(1),
sellPrice: faker.lorem.sentence(1),
imagePath: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
