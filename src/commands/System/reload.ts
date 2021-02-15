// Reload command is from godfather (https://github.com/Stitch07/godfather) Copyright 2020 Stitch07, used under the AGPL-3.0 License
import type { Args, CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['r'],
	fullCategory: ['System'],
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
