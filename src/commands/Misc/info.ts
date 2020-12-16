import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions } from '@sapphire/framework';
import { Message } from 'discord.js';
import SapphireCommand from '@lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	description: 'Shows you useful information about the bot.'
})
export default class InfoCommand extends SapphireCommand {

	public async run(message: Message) {
		const messageText = [
			`Sapphire v${this.client.version} is a Pokémon based Discord Bot for the Pokémon Crossroads Discord server`,
			' ',
			'**Sapphire features:**',
			'• Look up a Pokémon\'s dex entries, stats, abilities',
			'• Look up items and moves'
		];

		return message.channel.send(messageText.join('\n'));
	}

}