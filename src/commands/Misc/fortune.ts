import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed, Emoji } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { fortunes } from '#data/fortunes';
import Fuse from 'fuse.js';

@ApplyOptions<CommandOptions>({
	aliases: ['eightball'],
	category: 'Misc',
	description: 'Ask the eightball a question, get a random response.'
})
export default class EightBallCommand extends SapphireCommand {
	public async run(message: Message) {
		const fortuneOptions = {
			keys: ['id']
		};
		const fortune = this.context.client.emojis.cache.find((emoji: Emoji) => emoji.name === 'fortune');
		const random = Math.floor(Math.random() * 54) + 1;
		const randomTxt = random.toString();
		const fortunesFuse = new Fuse(fortunes.fortunes, fortuneOptions);
		const result = fortunesFuse.search(randomTxt);
		console.log();
		const fortuneEmbed = new MessageEmbed();

		fortuneEmbed.setColor('#ffff00').addField(`${fortune} Fortune`, result[0].item.msg);

		return message.channel.send(fortuneEmbed);
	}
}
