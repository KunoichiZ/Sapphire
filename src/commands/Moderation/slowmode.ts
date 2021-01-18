/* eslint-disable no-negated-condition */
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { POOL } from '#root/config';

@ApplyOptions<CommandOptions>({
	aliases: ['slow'],
	category: 'Moderation',
	description: 'Bans a member from the server',
	preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class BanCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const time = await args.pick('string');
		const channel = message.channel as TextChannel;
		// const channel = message.guild?.channels.cache.get(message.channel.id)
		let reason = await args.rest('string').catch(() => null);
		reason = reason !== null ? reason : 'No reason given by staff';
		const slowmodeEmbed = new MessageEmbed();
		const guildID = message.guild?.id;
		const selectQuery = `SELECT modlogschannel FROM guilds WHERE id=${guildID}`;
		POOL.query(selectQuery, (err, res) => {
			if (err) {
				console.log(err.stack);
			}
			const { modlogschannel } = res.rows[0];
			const modlogsChannel = message.guild?.channels.cache.find((channel) => channel.name === modlogschannel) as TextChannel;
			slowmodeEmbed.setColor(message.member?.displayHexColor as string);
			if (time === 'off') {
				const duration = 0;
				reason = 'Slowmode turned off';
				slowmodeEmbed.addField('Slowmode Set', `${duration} seconds`);
				channel.setRateLimitPerUser(duration, reason);
				message.channel.send(`Slowmode set to ${duration}, reason: ${reason}`);
			} else {
				const duration = parseInt(time, 10);
				slowmodeEmbed.addField('Slowmode Set', `${duration} seconds`);
				channel.setRateLimitPerUser(duration, reason as string);
				message.channel.send(`Slowmode set to ${duration}, reason: ${reason}`);
			}
			slowmodeEmbed.addField('Reason', reason);

			return modlogsChannel.send(slowmodeEmbed);
		});
	}
}
