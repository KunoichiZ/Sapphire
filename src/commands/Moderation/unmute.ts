/* eslint-disable no-else-return */
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel, Role } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['um'],
	category: 'Moderation',
	description: 'Unmutes the selected member',
	preconditions: ['OwnerOnly', 'AdminOnly']
})
export default class UnmuteCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const user = await args.pick('user');
		const modlogsChannel = this.context.client.channels.cache.get('683163930344161310') as TextChannel;
		const member = await message.guild!.members.fetch(user.id).catch(() => null);

		if (member?.manageable) {
			if (member.roles.cache.find((r) => r.name === 'Muted')) {
				const muteRole = message.guild?.roles.cache.find((role) => role.name === 'Muted') as Role;

				member.roles.remove(muteRole);
				const muteEmbed = new MessageEmbed()
					.setColor(message.member?.displayHexColor as string)
					.setAuthor(message.author.tag, message.author.displayAvatarURL())
					.setDescription(`**Action:** Unmuted <@${member?.id}>`);
				message.channel.send(muteEmbed);
				return modlogsChannel.send(muteEmbed);
			} else {
				return message.channel.send('User is not currently muted!');
			}
		} else {
			return message.channel.send('I cannot manage this member.');
		}
	}
}
