
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
name: faker.lorem.sentence(1),
email: faker.internet.email(),
password: "asdf123",
is_email_verified: faker.lorem.sentence(1),
remember_token: faker.lorem.sentence(1),
email_verified_at: faker.lorem.sentence(1),

        };
        data = [...data, fake];
    }
    return data;
};
