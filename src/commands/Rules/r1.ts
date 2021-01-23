import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { BrandingColors } from '#utils/Branding';

@ApplyOptions<CommandOptions>({
	fullCategory: ['Rules'],
	description: 'Displays the first rule of the server'
})
export default class Rule1Command extends SapphireCommand {
	public run(message: Message) {
		const r1Embed = new MessageEmbed()
			.setTitle('Pokemon Crossroads Discord Rules')
			.setColor(BrandingColors.Primary)
			.addField(
				'Rule 1',
				'Make sure to be familiar with and follow all PXR forum rules, which can be read here: [http://www.pokemoncrossroads.com/forum/showthread.php?152-Pokemon-Crossroads-Community-Rules](http://www.pokemoncrossroads.com/forum/showthread.php?152-Pokemon-Crossroads-Community-Rules)\n Notable rules include avoiding swearing at other members, keeping your content PG13, and not bullying other users.'
			);
		return message.channel.send(r1Embed);
	}
}
