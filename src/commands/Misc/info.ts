import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandContext, CommandOptions } from '@sapphire/framework';
import { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'Shows you useful information about the bot.'
})
export default class extends Command {

	public async run(message: Message, args: Args, context: CommandContext) {
		const messageText = [
			`Sapphire v${this.client.version} is a Pokémon based Discord Bot for the Pokémon Crossroads Discord server`,
			' ',
			'**Sapphire features:**',
			'• Look up a Pokémon\'s dex entries, stats, abilities',
			'• Look up items, moves, and type machups'
		];

		return message.channel.send(messageText.join('\n'));
	}

}