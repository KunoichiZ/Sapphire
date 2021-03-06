/* eslint-disable no-negated-condition */
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { POOL } from '#root/config';

@ApplyOptions<CommandOptions>({
	aliases: ['k'],
	fullCategory: ['Moderation'],
	description: 'Kicks a member from the server',
	preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class KickCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const user = await args.pick('user');
		if (!user) throw '**User not provided.** Users can be either an id or mention.';
		const member = await message.guild!.members.fetch(user?.id).catch(() => null);
		if (!member) throw '**Member not found.** Please make sure the user is in this guild.';
		if (member.id === message.author.id) message.reply("I don't think you want to ban yourself.");
		if (!member.kickable) message.reply('I cannot ban that member, their role is probably higher than my own!');

		let reason = await args.rest('string').catch(() => null);
		reason = reason !== null ? reason : 'No reason given by staff';

		if (reason && reason.length > 1000) throw 'Reason maximum char length is 1000.';
		member.kick(reason);

		const guildID = message.guild?.id;
		const selectQuery = `SELECT modlogschannel FROM guilds WHERE id=${guildID}`;
		POOL.query(selectQuery, (err, res) => {
			if (err) {
				console.log(err.stack);
			}
			const { modlogschannel } = res.rows[0];
			const modlogsChannel = message.guild?.channels.cache.find((channel) => channel.name === modlogschannel) as TextChannel;
			const kickEmbed = new MessageEmbed().setColor(message.member?.displayHexColor as string).setDescription(`
			**Member:** ${member.user.tag} (${member.id})\n
			**Action:** Kick\n
			**Reason:** ${reason}`);

			message.channel.send(`Successfully kicked ${member.user.tag} (${member.id}, reason: ${reason}`);
			modlogsChannel.send(kickEmbed);
		});
	}
}
