import { FarmFactory } from "../../seeding/factories/farm.factory";
import { UserFactory } from "../../seeding/factories/user.factory";
import { Seeder } from "@concepta/typeorm-seeding";

export class InitialSeed extends Seeder {

  public async run() {
    for (let i = 0; i < 4; i++) {
      const user = await this.factory(UserFactory).create();
      await this.factory(FarmFactory).createMany(30, { user_id: user.id } );
    }
  }
}
