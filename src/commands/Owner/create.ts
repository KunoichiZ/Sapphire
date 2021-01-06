import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import GuildEntity from '#orm/entities/GuildEntity';
import { PREFIX } from '#root/config';

@ApplyOptions<CommandOptions>({
	category: 'Owner',
	description: 'Database creation tool'
})
export default class CreateCommand extends SapphireCommand {
    public async run(message: Message) {
        const existing = await GuildEntity.findOne({ id: message.guild?.id });
		if (existing) return message.reply('Database document already exists!');

		const guild = await GuildEntity.create({ id: message.guild?.id })
		guild.prefix = PREFIX;
		guild.save();
		console.dir(guild);
		return message.reply(`Created a guild entry with the id of \`${guild.id}\`.`);
    }
}