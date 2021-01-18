import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { POOL } from '#root/config';

@ApplyOptions<CommandOptions>({
	aliases: ['nick', 'n'],
	category: 'Moderation',
	description: 'Nicknames the selected member with the provided nickname',
	preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class NicknameCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const user = await args.pick('user');
		if (!user) throw '**User not provided.** Users can be either an id or mention.';
		const nickname = await args.rest('string');
		if (nickname && nickname.length > 1000) throw 'Reason maximum char length is 1000.';
		const member = await message.guild!.members.fetch(user?.id).catch(() => null);
		if (!member) throw '**Member not found.** Please make sure the user is in this guild.';

		const oldName = member.displayName;
		const nicknameEmbed = new MessageEmbed();
		member.setNickname(nickname);

		const guildID = message.guild?.id;
		const selectQuery = `SELECT modlogschannel FROM guilds WHERE id=${guildID}`;
		POOL.query(selectQuery, (err, res) => {
			if (err) {
				console.log(err.stack);
			}
			const { modlogschannel } = res.rows[0];
			const modlogsChannel = message.guild?.channels.cache.find((channel) => channel.name === modlogschannel) as TextChannel;

			nicknameEmbed.setColor(member.displayHexColor).setDescription(`**Action:** Nickname change\n
			**Member:** <@${member.id}> (${member.user.tag})\n
			**Old name:** ${oldName}\n
			**New name:** ${nickname}\n`);

			if (message.deletable) {
				message.delete();
			}

			modlogsChannel.send(nicknameEmbed);
		});
	}
}
