import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { Timestamp } from '@sapphire/time-utilities';
import { BrandingColors } from '#utils/Branding';

@ApplyOptions<CommandOptions>({
	category: 'Info',
	description: 'Shows you information about the server'
})
export default class BasicCommand extends SapphireCommand {
	public async run(message: Message) {
		const createdAt = new Date(message.guild?.createdTimestamp as number);
		const timestamp = new Timestamp('MMMM DD, YYYY [at] HH:mm:ss [UTC]Z');
		const formatted = timestamp.display(createdAt);

		const serverEmbed = new MessageEmbed()
			.setColor(BrandingColors.Primary)
			.addField('Server Name', message.guild?.name, true)
			.addField('Members', message.guild?.memberCount, true)
			.addField('Created At', formatted);

		return message.channel.send(serverEmbed);
	}
}
