
import { faker } from "@faker-js/faker";
export default (user,count,branchIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
branchId: branchIdIds[i % branchIdIds.length],
name: faker.lorem.sentence(1),
type: faker.lorem.sentence(1),
image: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
