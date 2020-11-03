import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { Message } from 'discord.js';

ApplyOptions<CommandOptions>({
    name: 'test',
    aliases: ['t'],
    preconditions: ['OwnerOnly'],
})

export default class TestCommand extends Command {
    public run(message: Message) {
		return message.channel.send("test message working!");
	}
}