import { Awaited, err, ok, Precondition, Result, UserError } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class GuildPrecondition extends Precondition {
	public run(message: Message): Awaited<Result<unknown, UserError>> {
		return message.guild === null ? ok() : err(new UserError('guildOnly', 'This command can only be used in a guild.'));
	}
}
