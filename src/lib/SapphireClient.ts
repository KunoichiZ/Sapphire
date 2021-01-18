/* eslint-disable no-else-return */
import { SapphireClient } from '@sapphire/framework';
import type { ClientOptions, Message } from 'discord.js';
import { POOL, PREFIX } from '#root/config';

export class SBClient extends SapphireClient {
	private _version = [1, 0, 0];

	public constructor(options?: ClientOptions) {
		super(options);
		this.registerUserDirectories();
		this.fetchPrefix = (message: Message) => {
			if (!message.guild) return [PREFIX, ''];
			const id = message.guild?.id as string;
			const selectQuery = `SELECT prefix FROM guilds WHERE id=${id}`;
			let prefix = '';
			POOL.query(selectQuery, (err, res) => {
				if (err) {
					return console.log(err.stack);
				} else {
					prefix = res.rows[0].prefix;
					message.channel.send(
						message.guild ? `My prefix in this server is set to: \`${prefix}\`` : "You don't have to use a prefix in Direct Messages."
					);
					return prefix;
				}
			});
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
