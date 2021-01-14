// Emoji argument is from Dominus (https://github.com/dominus-project/dominus) Copyright 2021 RealShadowNova, used under the Apache-2.0 License
import { EmojiRegex, TwemojiRegex } from '@sapphire/discord-utilities';
import { Argument, PieceContext } from '@sapphire/framework';
import type { EmojiResolvable } from 'discord.js';

export default class extends Argument<EmojiResolvable> {
	public constructor(context: PieceContext) {
		super(context, { name: 'emoji' });
	}

	public async run(argument: string) {
		const emoji = EmojiRegex.exec(argument)?.[3];
		const twemoji = new RegExp(TwemojiRegex).exec(argument)?.[0] ?? null;
		const resolvable = emoji ? this.context.client.emojis.cache.get(emoji) : twemoji;

		if (!resolvable) return this.error('EmojiArgument', 'Emoji resolvable not found.');
		return this.ok(resolvable);
	}
}
