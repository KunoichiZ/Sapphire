import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { format } from '#utils/durationFormat';

@ApplyOptions<CommandOptions>({
	fullCategory: ['Info'],
	description: "Shows you the bot's uptime"
})
export default class UptimeCommand extends SapphireCommand {
	public async run(message: Message) {
		return message.channel.send(`I've been online for ${format(this.context.client.uptime ?? 0)}.`);
	}
}
