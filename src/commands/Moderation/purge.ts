import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import type { Message, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['purge', 'nuke', 'sweep'],
	category: 'Moderation',
	description: 'Prunes a certain amount of messages',
	preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class PurgeCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const amount = await args.pick('number').catch(() => null);

		if (!amount) throw 'Amount not found.';

		await (message.channel as TextChannel).bulkDelete(amount > 100 ? 100 : amount);

		// await message.channel.bulkDelete(amount > 100 ? 100 : amount);

		return message.channel.send(`Purged ${amount > 100 ? 100 : amount} messages.`);
	}
}
