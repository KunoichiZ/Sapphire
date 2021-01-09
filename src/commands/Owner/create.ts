import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import UserEntity from '#orm/entities/UserEntity';
// import { PREFIX } from '#root/config';

@ApplyOptions<CommandOptions>({
	category: 'Owner',
	description: 'Database creation tool'
})
export default class CreateCommand extends SapphireCommand {
    public async run(message: Message) {
        const existing = await UserEntity.findOne({ id: message.author.id });
		if (existing) return message.reply('Database document already exists!');

		const user = await UserEntity.create({ id: message.author.id })
		user.switchFC = '';
		user.goFC = '';
		user.save();
		console.dir(user);
		return message.reply(`Created a user entry with the id of \`${user.id}\`.`);
    }
}