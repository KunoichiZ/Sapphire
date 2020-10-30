  
require('module-alias/register');
import 'reflect-metadata';
import { TOKENS, PREFIX } from '@root/config';
import { SapphireClient } from '@sapphire/framework';
import type { ClientOptions, Message } from 'discord.js';
import { join } from 'path';

export class SBClient extends SapphireClient {

    public constructor(options?: ClientOptions) {
      super(options);
      // this.arguments.registerPath(join(__dirname, '..', 'arguments'));
      this.commands.registerPath(join(__dirname, 'commands'));
      // this.events.registerPath(join(__dirname, '..', 'events'));
      // this.preconditions.registerPath(join(__dirname, '..', 'preconditions'));
      this.registerUserDirectories();
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

