import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { BrandingColors } from '#utils/Branding';

@ApplyOptions<CommandOptions>({
	category: 'Rules',
	description: 'Displays the third rule of the server'
})
export default class Rule3Command extends SapphireCommand {
	public run(message: Message) {
		const r3Embed = new MessageEmbed()
			.setTitle('Pokemon Crossroads Discord Rules')
			.setColor(BrandingColors.Primary)
			.addField(
				'Rule 3',
				'Breaking rules in this server may end up in a punishment on the forum as well, depending on the nature and severity.'
			);
		return message.channel.send(r3Embed);
	}
}
