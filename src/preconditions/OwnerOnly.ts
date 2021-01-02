// OwnerOnly precondition is from Skyra (https://github.com/skyra-project/skyra) Copyright 2021 Antonio Román, used under the Apache-2.0 License
import { Awaited, err, ok, Precondition, Result, UserError } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { OWNER_ID } from '#root/config';

export class ClientPrecondition extends Precondition {
	public run(message: Message): Awaited<Result<unknown, UserError>> {
		return message.author.id === OWNER_ID ? ok() : err(new UserError('ownerOnly', 'Only the owner is allowed to execute this command.'));
	}
}
