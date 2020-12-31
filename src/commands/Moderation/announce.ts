import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import type { Message, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['news', 'announcement'],
	category: 'Moderation',
	description: 'Creates an announcement',
	preconditions: ['OwnerOnly']
})
export default class AnnounceCommand extends SapphireCommand {
	public async run(_message: Message, args: Args) {
		const announcement = await args.rest('string');
		const announcementChannel = this.context.client.channels.cache.get('719046614408495116') as TextChannel;
		announcementChannel.send(announcement);
	}
}
