import type { CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['ul'],
	category: 'Moderation',
	description: 'Unlocks the channel',
	preconditions: ['OwnerOnly', 'AdminOnly']
})
export default class UnlockCommand extends SapphireCommand {
	public async run(message: Message) {
		const unlockEmbed = new MessageEmbed();
		const modlogsChannel = this.context.client.channels.cache.get('683163930344161310') as TextChannel;
		const channel = message.guild?.channels.cache.find((channel) => channel.id === message.channel.id) as TextChannel;
		const everyone = message.guild?.roles.everyone.id as string;
		const prefix = await this.context.client.fetchPrefix(message);
		channel.overwritePermissions(
			[
				{
					id: everyone,
					deny: ['SEND_MESSAGES']
				}
			],
			'Unlock'
		);

		unlockEmbed
			.setColor(message.member?.displayHexColor as string)
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setDescription(
				`**Action:** 🔓 unlocked the \`${channel.name}\` channel.
        **Details:** This channel can now be used by everyone again. Use \`${prefix}lockdown\` in this channel to (re)-lock it.`
			)
			.setTimestamp();

		modlogsChannel.send(unlockEmbed);

		if (message.deletable) {
			message.delete();
		}
	}
}
