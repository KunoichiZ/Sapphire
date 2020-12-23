// Ping command from godfather (https://github.com/Soumil07/godfather) Copyright 2020 Soumil07, used under the AGPL-3.0 License
import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions } from '@sapphire/framework';
import { Message } from 'discord.js';
import SapphireCommand from '@lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	description: 'Runs a connection test to Discord.'
})
export default class PingCommand extends SapphireCommand {

	public async run(message: Message) {
		const sent = await message.channel.send('Pinging...');
		const ping = sent.createdTimestamp - message.createdTimestamp;
		return sent.edit(`Pong! That took ${ping}ms. Latency: ${this.context.client.ws.ping}ms`);
	}

}