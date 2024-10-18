
import { faker } from "@faker-js/faker";
export default (user,count,customerIdIds,branchIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
customerId: customerIdIds[i % customerIdIds.length],
branchId: branchIdIds[i % branchIdIds.length],
shippingAddress1: faker.lorem.sentence(1),
shippingAddress2: faker.lorem.sentence(1),
shippingAddress3: faker.lorem.sentence(1),
shippingCity: faker.lorem.sentence(1),
shippingState: faker.lorem.sentence(1),
postalCode: faker.lorem.sentence(1),
billingAddress1: faker.lorem.sentence(1),
billingAddress2: faker.lorem.sentence(1),
billingAddress3: faker.lorem.sentence(1),
billingCity: faker.lorem.sentence(1),
billingState: faker.lorem.sentence(1),
postalCode1: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
