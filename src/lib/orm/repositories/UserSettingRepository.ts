import UserSettingsEntity  from "@orm/entities/UserSettings";
import { EntityRepository, FindOneOptions, Repository } from "typeorm";

@EntityRepository(UserSettingsEntity)
export class UserRepository extends Repository<UserSettingsEntity> {
    public async ensure(id: string, options?: FindOneOptions<UserSettingsEntity>) {
		const previous = await this.findOne(id, options);
		if (previous) return previous;

		const data = new UserSettingsEntity();
		data.id = id;
		return data;
	}
}