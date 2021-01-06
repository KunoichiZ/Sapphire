import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['cl', 'log'],
	category: 'Info',
	description: 'Displays the changelog'
})
export default class AvatarCommand extends SapphireCommand {
	public async run(message: Message) {
		const changelogEmbed = new MessageEmbed();
		changelogEmbed.setColor('#11806a').setAuthor(`${this.context.client.user?.username}'s changelog`).setDescription(stripIndents`
        **Rewrite to Sapphire from Sheriff Magnezone, using the Sapphire Discord.js Bot Framework`)
		.addField('Source Code', '[Sapphire Source Code](https://github.com/KunoichiZ/Sapphire/)');

		return message.channel.send(changelogEmbed);
	}
}
