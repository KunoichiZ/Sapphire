// Help command from Gitcord (https://github.com/gitcord-project) Copyright 2020 Charalampos Fanoulis, used under the MIT license

import { ApplyOptions } from '@sapphire/decorators';
import { Args, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '@lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
    aliases: ['commands', 'cmd', 'cmds', 'h'],
    description: 'Gives you a list of commands',
	detailedDescription: 'You may also provide a command, which will return info about that command',
	preconditions: []
})

export default class HelpCommand extends SapphireCommand {
    public async run(message: Message, args: Args) {
		const command = await args.pickResult('string');
		if (command.success) return this.commandHelp(message, command.value);
		return message.channel.send(this.mapCommandsToStr());
	}

	private async commandHelp(message: Message, cmd: string) {
		const command = this.context.client.commands.get(cmd);
		if (typeof command === 'undefined') return message.channel.send("Couldn't find that command!");
		return message.channel.send(
			new MessageEmbed()
				.setColor(0x1100ff)
				.setTitle(command.name)
				.setDescription(`${command.description}`)
				.addField('\u200B', '\u200B')
				.addField('In detail:', command.detailedDescription)
		);
	}

	private mapCommandsToStr() {
		return this.context.client.commands.map((val) => `${val.name} → ${val.description}`).join('\n');
	}
}