/* eslint-disable no-negated-condition */
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { getGuild } from '#utils/get';

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
		const { modlogsChannel } = await getGuild(message.guild?.id as string);
		const modLogsChannel = message.guild?.channels.cache.find((channel) => channel.name === modlogsChannel) as TextChannel;

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
			channel.setRateLimitPerUser(duration, reason);
			message.channel.send(`Slowmode set to ${duration}, reason: ${reason}`);
		}
		slowmodeEmbed.addField('Reason', reason);

		return modLogsChannel.send(slowmodeEmbed);
	}
}
