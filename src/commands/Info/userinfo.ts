import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { Timestamp } from '@sapphire/time-utilities';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	fullCategory: ['Info'],
	description: 'Displays information about a specific user.'
})
export default class UserinfoCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const user = await args.pick('user');

		const member = await message.guild!.members.fetch(user?.id).catch(() => null);
		const tag = member?.user.tag;
		const username = member?.user.username;
		const joinedDiscord = member?.user.createdAt as Date;
		const joinedServer = member?.joinedAt as Date;
		const nickname = member?.nickname;
		const color = member?.displayHexColor as string;
		const avatar = member?.user.displayAvatarURL({ format: 'png' }) as string;
		const timestamp = new Timestamp('dddd, MMMM DD YYYY, h:mm:ss a');
		const joinedDiscordFormatted = timestamp.display(joinedDiscord);
		const joinedServerFormatted = timestamp.display(joinedServer);
		const roles = member?.roles.cache.map((r) => `${r}`).join(' | ');
		const roleCount = member?.roles.cache.size;

		const uinfoEmbed = new MessageEmbed()
			.setAuthor(tag)
			.setThumbnail(avatar)
			.setColor(color)
			.addField('Name', username, true)
			.addField('Nickname', nickname ? nickname : 'No Nickname', true)
			.addField(`Roles [${roleCount}]`, roles)
			.addField('Joined Discord', joinedDiscordFormatted)
			.addField('Joined Server', joinedServerFormatted);

		message.channel.send(uinfoEmbed);
	}
}
