/* eslint-disable no-else-return */
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel, Role } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { getGuild } from '#utils/get';

@ApplyOptions<CommandOptions>({
	aliases: ['m'],
	category: 'Moderation',
	description: 'Mutes the selected member',
	preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class MuteCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const user = await args.pick('user');
		const modlogsChannel = (await getGuild(message.guild?.id as string)).modlogsChannel;
        let channel = message.guild?.channels.cache.find(channel => channel.name === modlogsChannel) as TextChannel;
		const member = await message.guild!.members.fetch(user.id).catch(() => null);

		if (member?.manageable) {
			const muteRole = message.guild?.roles.cache.find((role) => role.name === 'Muted') as Role;

			member.roles.add(muteRole);
			const muteEmbed = new MessageEmbed()
				.setColor(message.member?.displayHexColor as string)
				.setAuthor(message.author.tag, message.author.displayAvatarURL()).setDescription(`**Action:** Muted <@${member?.id}>\n
            **Duration:** Until manually removed\n`);
			message.channel.send(muteEmbed);
			return channel.send(muteEmbed);
		} else {
			return message.channel.send('I cannot manage this member.');
		}
	}
}
