// AdminOnly precondition is from godfather (https://github.com/Soumil07/godfather) Copyright 2021 Soumil07, used under the AGPL-3.0 License
import { Precondition } from '@sapphire/framework';
import { Message, Permissions } from 'discord.js';

export default class extends Precondition {
	public run(message: Message) {
		if (message.guild && message.member!.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return this.ok();
		return this.error({ message: 'This command can only be used by server admins.' });
	}
}
