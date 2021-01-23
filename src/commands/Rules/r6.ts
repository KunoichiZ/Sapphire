import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { BrandingColors } from '#utils/Branding';

@ApplyOptions<CommandOptions>({
	fullCategory: ['Rules'],
	description: 'Displays the sixth rule of the server'
})
export default class Rule6Command extends SapphireCommand {
	public run(message: Message) {
		const r6Embed = new MessageEmbed()
			.setTitle('Pokemon Crossroads Discord Rules')
			.setColor(BrandingColors.Primary)
			.addField(
				'Rule 6',
				"While <#428323877433901056> does exist for venting or ranting purposes, please keep in mind that the members of PXR's community are not trained professionals. They are not required to respond to your messages and may not have the same opinion as you on certain issues. We encourage you to seek professional help in the form of a therapist rather than repeated use of the venting channel. Please call 1-800-273-8255 (USA), 116-123 (UK), 1-833-456-4566 (Canada), or 13-11-14 (Australia) if you are experiencing suicidal thoughts or feelings."
			);
		return message.channel.send(r6Embed);
	}
}
