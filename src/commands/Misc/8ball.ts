import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { predictions } from '#data/predictions';

@ApplyOptions<CommandOptions>({
	aliases: ['eightball'],
	category: 'Misc',
	description: 'Ask the eightball a question, get a random response.'
})
export default class EightBallCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const question = await args.pick('string');
		const hexColor = message.member?.displayHexColor as string;
		const eightballEmbed = new MessageEmbed()
			.setColor(hexColor)
			.addField(`${message.author.tag} asked`, question)
			.addField(":8ball:'s response", this.getResult());
		return message.channel.send(eightballEmbed);
	}

	private randomInt(low: number, high: number) {
		return Math.floor(Math.random() * (high - low) + low);
	}

	private getResult() {
		return predictions[this.randomInt(0, predictions.length)];
	}
}
