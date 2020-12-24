import GuildSettings from '#lib/orm/entities/GuildSettings';
import GuildSettingRepository from '#lib/orm/repositories/GuildSettingRepository';
import { PGSQL_ENABLED, PREFIX } from '#root/config';
import { SapphireClient } from '@sapphire/framework';
import { ClientOptions, Guild, Message } from 'discord.js';
import { getCustomRepository } from 'typeorm';

export class SBClient extends SapphireClient {
	public settingsCache = new Map<string, GuildSettings>();
	private _version = [1, 0, 0];

	public constructor(options?: ClientOptions) {
		super(options);
		this.registerUserDirectories();
		this.fetchPrefix = async (message: Message) => {
			if (!message.guild) return [PREFIX, ''];
			return this.fetchGuildPrefix(message.guild);
		};
	}

	public get invite() {
		return `https://discord.com/oauth2/authorize?client_id=${this.user!.id}&scope=bot`;
	}

	public async fetchGuildPrefix(guild: Guild) {
		if (!PGSQL_ENABLED) return PREFIX;
		const guildSettings: GuildSettings = await getCustomRepository(GuildSettingRepository).ensure(this, guild);
		return guildSettings.prefix;
	}

	public get version() {
		const versionStr = this._version.join('.');
		return versionStr;
	}
}
