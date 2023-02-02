import { faker } from "@faker-js/faker";
import { Factory } from "@concepta/typeorm-seeding";
import { User } from "../../../modules/users/entities/user.entity";
import config from "config/config";
import * as bcrypt from "bcrypt";

export class UserFactory extends Factory<User> {
  protected options = { entity: User };

  protected async entity(user: User): Promise<User> {
    user.email = faker.internet.email();
    const salt = await bcrypt.genSalt(config.SALT_ROUNDS);
    user.hashedPassword = await bcrypt.hash(faker.internet.password(), salt);
    user.createdAt = new Date(faker.date.past(2));
    user.address = `${faker.address.streetAddress(false)}, ${faker.address.cityName()}, ${faker.address.country()} `;
    user.latitude = parseFloat(faker.address.latitude())
    user.longitude = parseFloat(faker.address.longitude()) 
    return user;
  }
}
