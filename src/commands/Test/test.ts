import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
    aliases: ['t'],
    preconditions: ['OwnerOnly'],
})

export default class TestCommand extends Command {
    public run(message: Message) {
		return message.channel.send("test message working!");
	}
}