// Emoji argument is from Dominus (https://github.com/dominus-project/dominus) Copyright 2021 RealShadowNova, used under the Apache-2.0 License
import { EmojiRegex, TwemojiRegex } from '@sapphire/discord-utilities';
import { Argument, ArgumentResult, PieceContext } from '@sapphire/framework';
import type { EmojiResolvable } from 'discord.js';

export default class extends Argument<EmojiResolvable> {
	public constructor(context: PieceContext) {
		super(context, { name: 'emoji' });
	}

	public run(parameter: string): ArgumentResult<EmojiResolvable> {
		const emoji = EmojiRegex.exec(parameter)?.[3];
		const twemoji = new RegExp(TwemojiRegex).exec(parameter)?.[0] ?? null;
		const resolvable = emoji ? this.context.client.emojis.cache.get(emoji) : twemoji;

		if (!resolvable) return this.error({ parameter, message: 'Emoji resolvable not found.' });
		return this.ok(resolvable);
	}
}
