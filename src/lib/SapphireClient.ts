import { SapphireClient } from '@sapphire/framework';
import type { ClientOptions, Message, Guild } from 'discord.js';
import { getGuild } from '#utils/get';
import { PREFIX, PGSQL_ENABLED } from '#root/config';

export class SBClient extends SapphireClient {
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

	public get version() {
		const versionStr = this._version.join('.');
		return versionStr;
	}

	public async fetchGuildPrefix(guild: Guild) {
		if (!PGSQL_ENABLED) return PREFIX;
		const guildSettings = await getGuild(guild.id);
		return guildSettings.prefix;
	}
}
