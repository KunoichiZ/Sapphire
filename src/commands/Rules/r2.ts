import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { BrandingColors } from '#utils/Branding';

@ApplyOptions<CommandOptions>({
	fullCategory: ['Rules'],
	description: 'Displays the second rule of the server'
})
export default class Rule2Command extends SapphireCommand {
	public run(message: Message) {
		const r2Embed = new MessageEmbed()
			.setTitle('Pokemon Crossroads Discord Rules')
			.setColor(BrandingColors.Primary)
			.addField('Rule 2', 'Please use appropriate channels. Using commands should happen in <#419672986669547540>, for example.');
		return message.channel.send(r2Embed);
	}
}
