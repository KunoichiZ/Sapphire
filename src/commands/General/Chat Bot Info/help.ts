// Help command from Dominus (https://github.com/dominus-project/dominus) Copyright 2021 RealShadowNova, used under the Apache-2.0 License
import type { Args, CommandOptions, CommandStore } from '@sapphire/framework';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Message, MessageEmbed, APIMessage, TextChannel, NewsChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { BrandingColors } from '#utils/Branding';

@ApplyOptions<CommandOptions>({
	aliases: ['commands', 'cmd', 'cmds', 'h'],
	fullCategory: ['General', 'Chat Bot Info'],
	description: 'Shows you this command!',
	detailedDescription: 'You may also provide a command, which will return info about that command',
	preconditions: []
})
export default class HelpCommand extends SapphireCommand {
	private _commands!: CommandStore;

	public async run(message: Message, args: Args) {
		const commandName = await args.pick('string').catch(() => null);

		if (!commandName) return this.menu(message);

		this._commands = this.context.client.stores.get('commands');

		const command =
			this._commands.get(commandName.toLowerCase()) || this._commands.find((command) => command.aliases.includes(commandName.toLowerCase()));

		if (!command) throw 'Command not found. To view all commands run `help`';

		const embed = new MessageEmbed().setColor(BrandingColors.Secondary);

		if (command.aliases.length) embed.addField('❯ Aliases', command.aliases.map((alias) => `\`${alias}\``).join(' '));

		embed.addField('❯ Detailed Description', command.detailedDescription || 'No detailed description was provided.').setTimestamp();

		if (command.description) embed.setDescription(command.description);

		return message.channel.send(embed);
	}

	private async menu(message: Message) {
		const categories = new Set<string>();

		this._commands = this.context.client.stores.get('commands');

		for (const [, command] of this._commands.filter(
			(command) =>
				command.category.toLowerCase() !== 'system' && command.category.toLowerCase() !== 'owner' && command.category.toLowerCase() !== 'test'
		))
			categories.add(command.category);

		return new PaginatedMessage({
			pages: [...categories.values()].map((category) => (index, pages) =>
				new APIMessage(message.channel, {
					embed: new MessageEmbed()
						.setColor(BrandingColors.Primary)
						.setTitle(category)
						.setDescription(
							this._commands
								.filter((command) => command.category.toLowerCase() === category.toLowerCase())
								.map((command) => `\`${command.name}\` → ${command.description || 'No description was provided.'}`)
						)
						.setFooter(`Page ${index + 1} / ${pages.length}`)
				})
			)
		}).run(message.author, message.channel as TextChannel | NewsChannel);
	}
}
