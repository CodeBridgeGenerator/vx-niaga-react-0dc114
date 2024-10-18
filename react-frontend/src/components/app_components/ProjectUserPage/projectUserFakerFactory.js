
import { faker } from "@faker-js/faker";
export default (user,count,userIdIds,projectIdIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
userId: userIdIds[i % userIdIds.length],
projectId: projectIdIds[i % projectIdIds.length],
isActive: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
