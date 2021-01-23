import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import type { Message, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { POOL } from '#root/config';

@ApplyOptions<CommandOptions>({
	aliases: ['news', 'announcement'],
	fullCategory: ['Moderation'],
	description: 'Creates an announcement',
	preconditions: ['OwnerOnly']
})
export default class AnnounceCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const announcement = await args.rest('string');
		const guildID = message.guild?.id;
		const selectQuery = `SELECT modlogschannel FROM guilds WHERE id=${guildID}`;
		POOL.query(selectQuery, (err, res) => {
			if (err) {
				console.log(err.stack);
			} else {
				const { announcementchannel } = res.rows[0];
				const announcementChannel = message.guild?.channels.cache.find((channel) => channel.name === announcementchannel) as TextChannel;
				announcementChannel.send(announcement);
			}
		});
	}
}
