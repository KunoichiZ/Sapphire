// Prefix command from godfather (https://github.com/Soumil07/godfather) Copyright 2020 Soumil07, used under the AGPL-3.0 License
import GuildSettingRepository from '#lib/orm/repositories/GuildSettingRepository';
import SapphireCommand from '#lib/SapphireCommand';
import type { Args, CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import { getCustomRepository } from 'typeorm';
// import { PGSQL_ENABLED } from '#root/config';

@ApplyOptions<CommandOptions>({
	description: 'View and change the server prefix.',
	preconditions: ['GuildOnly', ['AdminOnly', 'OwnerOnly']]
})
export default class extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const newPrefix = await args.restResult('string');
		const guildSettings = await getCustomRepository(GuildSettingRepository).ensure(this.context.client, message.guild!);

		if (!newPrefix.success) {
			return message.channel.send(`My prefix in this server is set to: ${guildSettings.prefix}`);
		}
		if (newPrefix.value.length > 10) throw 'Prefixes can be 10 characters at most.';
		guildSettings.prefix = newPrefix.value;
		await getCustomRepository(GuildSettingRepository).updateSettings(this.context.client, guildSettings);
		return message.channel.send(`Successfully updated this server's prefix to: \`${newPrefix.value}\``);
	}

	// public async onLoad() {
	// 	if (!PGSQL_ENABLED) {
	// 		await this.unload();
	// 	}
	// }
}
