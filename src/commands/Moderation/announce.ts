import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import type { Message, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { getGuild } from '#utils/get';

@ApplyOptions<CommandOptions>({
	aliases: ['news', 'announcement'],
	category: 'Moderation',
	description: 'Creates an announcement',
	preconditions: ['OwnerOnly']
})
export default class AnnounceCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const announcement = await args.rest('string');
		const announcementChannel = (await getGuild(message.guild?.id as string)).announcementchannel;
		let channel = message.guild?.channels.cache.find(channel => channel.name === announcementChannel) as TextChannel;
		channel.send(announcement);
	}
}
