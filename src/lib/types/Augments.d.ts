import { Piece } from '@sapphire/framework';
import { EmojiResolvable } from 'discord.js';

declare module 'discord.js' {
	interface Client {
		readonly version: string;
		readonly invite: string;
		fetchGuildPrefix(guild: Guild): Promise<string>;
	}
}

declare module '@sapphire/framework' {
	interface ArgType {
		duration: number;
		piece: Piece;
		emoji: EmojiResolvable;
	}

	interface Command {
		category: string;
	}

	interface CommandOptions {
		category: string;
	}
}
