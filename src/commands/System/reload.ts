// Reload command is from godfather (https://github.com/Soumil07/godfather) Copyright 2020 Soumil07, used under the AGPL-3.0 License
import type { Args, CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import SapphireCommand from '#lib/SapphireCommand';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	aliases: ['r'],
	preconditions: ['OwnerOnly']
})
export default class extends SapphireCommand {

	public async run(message: Message, args: Args) {
		const piece = await args.pickResult('piece');
		if (!piece.success) throw 'Missing required argument: piece';

		await piece.value.reload();
		return message.channel.send(`✅ Reloaded ${piece.value.store.name.slice(0, -1)}: ${piece.value.name}`);
	}

}