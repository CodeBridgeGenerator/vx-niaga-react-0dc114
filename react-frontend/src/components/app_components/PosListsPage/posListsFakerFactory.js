
import { faker } from "@faker-js/faker";
export default (user,count,branchIdIds,warehouseIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
branchId: branchIdIds[i % branchIdIds.length],
warehouseId: warehouseIdIds[i % warehouseIdIds.length],
name: faker.lorem.sentence(1),
userIds: faker.lorem.sentence(1),
status: "Inactive",

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
