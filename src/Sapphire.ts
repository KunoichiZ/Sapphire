  
require('module-alias/register');
import 'reflect-metadata';
import { TOKENS, PREFIX } from '@root/config';
import { SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';

export class SBClient extends SapphireClient {

    public constructor(options?: ClientOptions) {
      super(options);
      this.registerUserDirectories();
      this.fetchPrefix = () => PREFIX
  }
  
  public get invite() {
		return `https://discord.com/oauth2/authorize?client_id=${this.user!.id}&scope=bot`;
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