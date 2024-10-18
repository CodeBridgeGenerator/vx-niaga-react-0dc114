
import { faker } from "@faker-js/faker";
export default (user,count,branchIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
branchId: branchIdIds[i % branchIdIds.length],
modelType: faker.lorem.sentence(1),
modelId: faker.lorem.sentence(1),
qrPath: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
