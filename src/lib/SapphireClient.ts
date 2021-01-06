import { SapphireClient } from '@sapphire/framework';
import type { ClientOptions, Message } from 'discord.js';
import type GuildEntity from '#lib/orm/entities/GuildEntity';
import { PREFIX } from '#root/config';

export class SBClient extends SapphireClient {
	public settingsCache = new Map<string, GuildEntity>();
	private _version = [1, 0, 0];

	public constructor(options?: ClientOptions) {
		super(options);
		this.registerUserDirectories();
		this.fetchPrefix = async (message: Message) => {
			if (!message.guild) return [PREFIX, ''];
			return PREFIX;
		};
	}

	public get invite() {
		return `https://discord.com/oauth2/authorize?client_id=${this.user!.id}&scope=bot`;
	}

	public get version() {
		const versionStr = this._version.join('.');
		return versionStr;
	}
}
