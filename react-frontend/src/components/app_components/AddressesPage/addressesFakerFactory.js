
import { faker } from "@faker-js/faker";
export default (user,count,customerIdIds,branchIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
customerId: customerIdIds[i % customerIdIds.length],
branchId: branchIdIds[i % branchIdIds.length],
shippingAddress1: faker.datatype.number(""),
shippingAddress2: faker.datatype.number(""),
shippingAddress3: faker.datatype.number(""),
shippingCity: faker.datatype.number(""),
shippingState: faker.datatype.number(""),
postalCode: faker.datatype.number(""),
billingAddress1: faker.datatype.number(""),
billingAddress2: faker.datatype.number(""),
billingAddress3: faker.datatype.number(""),
billingCity: faker.datatype.number(""),
billingState: faker.datatype.number(""),
postalCode1: faker.datatype.number(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
