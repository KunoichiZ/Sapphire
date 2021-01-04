import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['listemoji'],
	category: 'Info',
	description: "Displays the server's emoji"
})
export default class EmojiCommand extends SapphireCommand {
	public run(message: Message) {
		const emojiList = message.guild?.emojis.cache.map((e) => e.toString()).join(' ');
		message.channel.send(emojiList as string);
	}
}
