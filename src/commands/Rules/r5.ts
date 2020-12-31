import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { BrandingColors } from '#utils/Branding';

@ApplyOptions<CommandOptions>({
	category: 'Rules',
	description: 'Displays the fifth rule of the server'
})
export default class Rule5Command extends SapphireCommand {
	public run(message: Message) {
		const r5Embed = new MessageEmbed()
			.setTitle('Pokemon Crossroads Discord Rules')
			.setColor(BrandingColors.Primary)
			.addField(
				'Rule 5',
				'If you see someone breaking the rules, ping or DM one of the PXR Discord Staff (<@147800635046232064>, <@167430839519412224>, <@565317272793776128>, or <@168844336224665601>) or one of the PXR Forum Senior Staff (<@167430839519412224>, <@169159308330795008>, <@165120366287650817>, or <@464480362450518025>).'
			);
		return message.channel.send(r5Embed);
	}
}
