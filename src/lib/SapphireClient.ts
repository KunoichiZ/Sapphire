/* eslint-disable no-else-return */
import { SapphireClient } from '@sapphire/framework';
import type { ClientOptions, Guild, Message } from 'discord.js';
import { DEV, DEV_PREFIX, PGSQL_ENABLED, POOL, PREFIX } from '#root/config';

export class SBClient extends SapphireClient {
	private _version = [1, 0, 0];

	public constructor(options?: ClientOptions) {
		super(options);
		this.registerUserDirectories();
		this.fetchPrefix = (message: Message) => {
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
		if (DEV) return DEV_PREFIX;
		const id = guild?.id as string;
		const selectQuery = `SELECT prefix FROM guilds WHERE id=${id}`;
		let prefix = '';
		await POOL.query(selectQuery, (err, res) => {
			if (err) {
				return console.log(err.stack);
			} else {
				prefix = res.rows[0].prefix;
				return prefix;
			}
		});
		return PREFIX;
	}
}
