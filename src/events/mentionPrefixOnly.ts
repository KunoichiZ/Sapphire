// mentionPrefixOnly event from Soumil07 (https://github.com/Soumil07/godfather) Copyright 2020 Soumil07, used under the AGPL-3.0 License

import { Event, Events, PieceContext } from '@sapphire/framework';
import type { Message } from 'discord.js';

export default class extends Event<Events.MentionPrefixOnly> {
	public constructor(context: PieceContext) {
		super(context, { event: Events.MentionPrefixOnly });
	}

	public async run(message: Message) {
		const prefix = await this.context.client.fetchPrefix(message);
		message.channel.send(
			message.guild ? `My prefix in this server is set to: \`${prefix}\`` : "You don't have to use a prefix in Direct Messages."
		);
	}
}
