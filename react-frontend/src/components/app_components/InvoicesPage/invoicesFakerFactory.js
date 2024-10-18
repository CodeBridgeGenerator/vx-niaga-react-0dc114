
import { faker } from "@faker-js/faker";
export default (user,count,branchIdIds,customerIdIds,categoryIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
branchId: branchIdIds[i % branchIdIds.length],
customerId: customerIdIds[i % customerIdIds.length],
invoiceDate: faker.lorem.sentence(1),
categoryId: categoryIdIds[i % categoryIdIds.length],
status: "Final",
source: faker.lorem.sentence(1),
deliveryStatus: "Shipped",
description: faker.lorem.sentence(1),
invoiceId: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
