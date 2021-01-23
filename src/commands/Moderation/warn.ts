/* eslint-disable no-else-return */
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { BrandingColors } from '#utils/Branding';
import { CLIENT_ID, OWNER_ID, POOL } from '#root/config';

@ApplyOptions<CommandOptions>({
	fullCategory: ['Moderation'],
	description: 'Warn a user in the guild.',
	preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class WarnCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const user = await args.pick('user');
		if (!user) message.channel.send('**User not provided.** Users can be either an id or mention.');
		if ([...OWNER_ID, CLIENT_ID, message.author.id].includes(user.id)) message.channel.send('Unable to use moderation actions on this user.');
		const member = await message.guild!.members.fetch(user?.id).catch(() => null);
		if (!member) message.channel.send('**Member not found.** Please make sure the user is in this guild.');

		const reason = await args.rest('string').catch(() => null);

		if (reason && reason.length > 1000) message.channel.send('Reason maximum char length is 1000.');

		const warnEmbed = new MessageEmbed()
			.setColor(BrandingColors.Primary)
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setDescription([`**Action**: Warn`, `**User**: ${user.tag} (${user.id})`, `**Reason**: ${reason || 'No reason was provided.'}`])
			.setTimestamp();

		const guildID = message.guild?.id;
		const selectWarnQuery = `SELECT id FROM warns WHERE id=${guildID}`;
		const selectGuildQuery = `SELECT totalwarns, modlogschannel FROM guilds WHERE id=${guildID}`;

		POOL.query(selectGuildQuery, (err, res) => {
			if (err) {
				return console.log(err.stack);
			} else {
				let { totalwarns } = res.rows[0];
				const { modlogschannel } = res.rows[0];
				const modlogsChannel = message.guild?.channels.cache.find((channel) => channel.name === modlogschannel) as TextChannel;
				totalwarns += 1;
				console.log(totalwarns);
				POOL.query(selectWarnQuery, (err, res) => {
					if (err) {
						return console.log(err.stack);
					} else if (res.rows[0] === undefined) {
						const caseID = totalwarns;
						POOL.query(`UPDATE guilds SET totalwarns = '${totalwarns}' WHERE id = ${guildID}`);
						POOL.query(`UPDATE warns SET id = '${user.id}' WHERE id = ${user.id}`);
						POOL.query(`UPDATE warns SET caseid = '${caseID}' WHERE id = ${user.id}`);
						POOL.query(`UPDATE warns SET reason = '${reason}' WHERE id = ${user.id}`);
						POOL.query(`UPDATE warns SET guild = '${guildID}' WHERE id = ${user.id}`);
						warnEmbed.setFooter(`Warn Case ${caseID}`, this.context.client.user!.displayAvatarURL());
						modlogsChannel.send(warnEmbed);
					}
				});
			}
		});
	}
}
