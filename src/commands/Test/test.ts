import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['t'],
	category: 'Test',
	preconditions: ['OwnerOnly']
})
export default class TestCommand extends SapphireCommand {
	public run(message: Message) {
		return message.channel.send('test message working!');
	}
}
