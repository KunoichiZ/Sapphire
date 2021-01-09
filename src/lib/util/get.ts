import { GuildEntity } from '#orm/entities/GuildEntity';
import UserEntity from '#orm/entities/UserEntity';

export async function getGuild(id: string): Promise<GuildEntity> {
    const guild = await GuildEntity.findOne({ id });
    if (guild) return guild;
    return GuildEntity.create({ id }).save();
}

export async function getUser(id: string): Promise<UserEntity> {
    const user = await UserEntity.findOne({ id });
    if (user) return user;
    return UserEntity.create({ id }).save();
}