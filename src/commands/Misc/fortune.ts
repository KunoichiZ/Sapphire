import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed, Emoji } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { fortunes } from '#data/fortunes';

@ApplyOptions<CommandOptions>({
	aliases: ['eightball'],
	category: 'Misc',
	description: 'Ask the eightball a question, get a random response.'
})
export default class EightBallCommand extends SapphireCommand {
	public async run(message: Message) {
		const obj_keys = Object.keys(fortunes.fortunes);
		const ran_key = obj_keys[Math.floor(Math.random() * obj_keys.length)];
		const key = Number(ran_key);
		const selectedFortune = fortunes.fortunes[key];

		const fortune = this.context.client.emojis.cache.find((emoji: Emoji) => emoji.name === 'fortune');

		const fortuneEmbed = new MessageEmbed();

		fortuneEmbed.setColor('#ffff00').addField(`${fortune} Fortune`, selectedFortune.msg);

		return message.channel.send(fortuneEmbed);
	}
}
