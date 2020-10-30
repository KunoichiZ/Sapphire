import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { Message } from 'discord.js';

export default class UserCommand extends Command {
    public async run(message: Message) {
		return message.channel.send("test message working!");
	}
}