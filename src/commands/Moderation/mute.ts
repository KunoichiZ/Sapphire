/* eslint-disable no-else-return */
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel, Role } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { POOL } from '#root/config';

@ApplyOptions<CommandOptions>({
	aliases: ['m'],
	category: 'Moderation',
	description: 'Mutes the selected member',
	preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class MuteCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const user = await args.pick('user');
		const member = await message.guild!.members.fetch(user.id).catch(() => null);

		const guildID = message.guild?.id;
		const selectQuery = `SELECT modlogschannel FROM guilds WHERE id=${guildID}`;
		POOL.query(selectQuery, (err, res) => {
			if (err) {
				console.log(err.stack);
			}
			const { modlogschannel } = res.rows[0];
			const modlogsChannel = message.guild?.channels.cache.find((channel) => channel.name === modlogschannel) as TextChannel;

			if (member?.manageable) {
				const muteRole = message.guild?.roles.cache.find((role) => role.name === 'Muted') as Role;

				member.roles.add(muteRole);
				const muteEmbed = new MessageEmbed()
					.setColor(message.member?.displayHexColor as string)
					.setAuthor(message.author.tag, message.author.displayAvatarURL()).setDescription(`**Action:** Muted <@${member?.id}>\n
				**Duration:** Until manually removed\n`);
				message.channel.send(muteEmbed);
				return modlogsChannel.send(muteEmbed);
			} else {
				return message.channel.send('I cannot manage this member.');
			}
		});
	}
}
