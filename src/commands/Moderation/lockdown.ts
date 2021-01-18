import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { POOL } from '#root/config';

@ApplyOptions<CommandOptions>({
	aliases: ['ld', 'lock'],
	category: 'Moderation',
	description: 'Locks down the channel',
	preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class LockdownCommand extends SapphireCommand {
	public async run(message: Message) {
		const lockEmbed = new MessageEmbed();
		const channel = message.guild?.channels.cache.find((channel) => channel.id === message.channel.id) as TextChannel;
		const everyone = message.guild?.roles.everyone.id as string;
		// const modLogsChannel = (await getGuild(message.guild?.id as string)).modlogsChannel;
		// const modlogsChannel = message.guild?.channels.cache.find((channel) => channel.name === modLogsChannel) as TextChannel;
		const prefix = await this.context.client.fetchPrefix(message);
		channel.overwritePermissions(
			[
				{
					id: everyone,
					allow: ['SEND_MESSAGES']
				}
			],
			'Lockdown'
		);
		// channel.overwritePermissions(message.guild?.id as string, {
		// 	SEND_MESSAGES: false
		// });
		const guildID = message.guild?.id;
		const selectQuery = `SELECT modlogschannel FROM guilds WHERE id=${guildID}`;
		POOL.query(selectQuery, (err, res) => {
			if (err) {
				console.log(err.stack);
			}
			const { modlogschannel } = res.rows[0];
			const modlogsChannel = message.guild?.channels.cache.find((channel) => channel.name === modlogschannel) as TextChannel;
			lockEmbed
				.setColor(message.member?.displayHexColor as string)
				.setAuthor(message.author.tag, message.author.displayAvatarURL())
				.setDescription(
					`**Action:** 🔒 locked the \`${channel.name}\` channel.\n
				**Details:** Only staff can now access this channel. Use \`${prefix}unlock\` in this channel to unlock the channel`
				)
				.setTimestamp();

			if (message.deletable) {
				message.delete();
			}

			modlogsChannel.send(lockEmbed);
		});
	}
}
