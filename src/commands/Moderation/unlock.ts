import type { CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { POOL } from '#root/config';

@ApplyOptions<CommandOptions>({
	aliases: ['ul'],
	category: 'Moderation',
	description: 'Unlocks the channel',
	preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class UnlockCommand extends SapphireCommand {
	public async run(message: Message) {
		const unlockEmbed = new MessageEmbed();
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

		const guildID = message.guild?.id;
		const selectQuery = `SELECT modlogschannel FROM guilds WHERE id=${guildID}`;
		POOL.query(selectQuery, (err, res) => {
			if (err) {
				console.log(err.stack);
			}
			const { modlogschannel } = res.rows[0];
			const modlogsChannel = message.guild?.channels.cache.find((channel) => channel.name === modlogschannel) as TextChannel;

			unlockEmbed
				.setColor(message.member?.displayHexColor as string)
				.setAuthor(message.author.tag, message.author.displayAvatarURL())
				.setDescription(
					`**Action:** 🔓 unlocked the \`${channel.name}\` channel.
        **Details:** This channel can now be used by everyone again. Use \`${prefix}lockdown\` in this channel to (re)-lock it.`
				)
				.setTimestamp();

			channel.send(unlockEmbed);
			modlogsChannel.send(unlockEmbed);

			if (message.deletable) {
				message.delete();
			}
		});
	}
}
