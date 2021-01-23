import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Timestamp } from '@sapphire/time-utilities';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	fullCategory: ['Info'],
	description: 'Displays information about the selected emoji'
})
export default class EmojiInfoCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const emojiResolvable = await args.pick('emoji');

		if (!emojiResolvable) throw 'Emoji not found.';

		const emoji = message.guild?.emojis.resolve(emojiResolvable);
		const hexColor = message.member?.displayHexColor as string;
		const timestamp = new Timestamp('dddd, MMMM DD YYYY, h:mm:ss a');
		const formatted = timestamp.display(emoji?.createdAt);

		const emojiinfoEmbed = new MessageEmbed();
		emojiinfoEmbed.setColor(hexColor).setTitle(`${emoji} ${emoji?.name}`).addField('ID', emoji?.id).addField('Added to Server', formatted);

		return message.channel.send(emojiinfoEmbed);
	}
}
