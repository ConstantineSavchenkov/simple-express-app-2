import { faker } from "@faker-js/faker";
import { Factory } from "@concepta/typeorm-seeding";
import { Farm } from "modules/farms/entities/farm.entity";

export class FarmFactory extends Factory<Farm> {
  protected options = { entity: Farm };

  protected async entity(farm: Farm): Promise<Farm> {
    farm.name = faker.animal.cow() + " farm";
    farm.yield = faker.datatype.float({ min: 3, max: 15 });
    farm.size = faker.datatype.float({ min: 18, max: 33 });
    farm.createdAt = new Date(faker.date.past(2));
    farm.address = `${faker.address.streetAddress(false)}, ${faker.address.cityName()}, ${faker.address.country()} `;
    farm.latitude = parseFloat(faker.address.latitude());
    farm.longitude = parseFloat(faker.address.longitude());
    return Promise.resolve(farm);
  }
}
