require('module-alias/register');
import 'reflect-metadata';
import { TOKENS, PREFIX, PGSQL_ENABLED } from '@root/config';
import { SapphireClient } from '@sapphire/framework';
import { Guild, Message } from 'discord.js';
import type { ClientOptions } from 'discord.js';
import GuildSettings from '@lib/orm/entities/GuildSettings';
import GuildSettingRepository from '@lib/orm/repositories/GuildSettingRepository';
import { getCustomRepository } from 'typeorm';

export class SBClient extends SapphireClient {

    public constructor(options?: ClientOptions) {
      super(options);
      this.registerUserDirectories();
      this.fetchPrefix = async (message: Message) => {
        if (!message.guild) return [PREFIX, ''];
        return this.fetchGuildPrefix(message.guild);
      };
  }

  public settingsCache = new Map<string, GuildSettings>();
  
  public get invite() {
		return `https://discord.com/oauth2/authorize?client_id=${this.user!.id}&scope=bot`;
  }

  public async fetchGuildPrefix(guild: Guild) {
		if (!PGSQL_ENABLED) return PREFIX;
		const guildSettings: GuildSettings = await getCustomRepository(GuildSettingRepository).ensure(this, guild);
		return guildSettings.prefix;
	}
  
  private _version = [1, 0, 0];

  public get version() {
		const versionStr = this._version.join('.');
    return versionStr;
  }
}

const client = new SBClient({
    defaultPrefix: PREFIX,
    presence: {
      activity: {
        name: 'Pokémon Emerald',
        type: 'STREAMING'
      }
    }
  });
  
client.login(TOKENS.BOT_TOKEN)
    .catch((error) => {
      client.logger.error(error);
});