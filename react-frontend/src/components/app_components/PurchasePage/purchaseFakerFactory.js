
import { faker } from "@faker-js/faker";
export default (user,count,branchIdIds,vendorIdIds,warehouseIdIds,purchaseTypeIds,categoryIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
branchId: branchIdIds[i % branchIdIds.length],
vendorId: vendorIdIds[i % vendorIdIds.length],
warehouseId: warehouseIdIds[i % warehouseIdIds.length],
purchaseType: purchaseTypeIds[i % purchaseTypeIds.length],
date: faker.lorem.sentence(1),
status: "Processing",
categoryId: categoryIdIds[i % categoryIdIds.length],
purchaseId: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
