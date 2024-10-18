
import { faker } from "@faker-js/faker";
export default (user,count,deliveryIdIds,productIdIds,variationIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
deliveryId: deliveryIdIds[i % deliveryIdIds.length],
productId: productIdIds[i % productIdIds.length],
variationId: variationIdIds[i % variationIdIds.length],
deliveredQty: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
