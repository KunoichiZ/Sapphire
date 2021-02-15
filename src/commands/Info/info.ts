// Info command is modified from godfather (https://github.com/Stitch07/godfather) Copyright 2020 Stitch07, used under the AGPL-3.0 License
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	fullCategory: ['Info'],
	description: 'Shows you useful information about the bot.'
})
export default class InfoCommand extends SapphireCommand {
	public async run(message: Message) {
		const messageText = [
			`Sapphire v${this.context.client.version} is a Pokémon based Discord Bot for the Pokémon Crossroads Discord server`,
			' ',
			'**Sapphire features:**',
			"• Look up a Pokémon's dex entries, stats, abilities",
			'• Look up items and moves'
		];

		return message.channel.send(messageText.join('\n'));
	}
}
