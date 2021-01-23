import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['icon'],
	fullCategory: ['Info'],
	description: 'Displays the avatar of the entered user'
})
export default class AvatarCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const user = await args.pick('user');
		const member = await message.guild!.members.fetch(user?.id).catch(() => null);
		const avatarEmbed = new MessageEmbed();
		avatarEmbed
			.setColor(member?.displayHexColor as string)
			.setTitle(`${member?.displayName}'s avatar`)
			.setImage(member?.user.displayAvatarURL({ format: 'png' }) as string);

		return message.channel.send(avatarEmbed);
	}
}
