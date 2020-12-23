import GuildSettingsEntity from '../orm/entities/GuildSettings';
import { Piece } from '@sapphire/framework';

declare module 'discord.js' {
	interface Client {
		readonly version: string;
        readonly invite: string;
        settingsCache: Map<string, GuildSettingsEntity>;
        fetchGuildPrefix(guild: Guild): Promise<string>;
    }
}

declare module '@sapphire/framework' {
	interface ArgType {
		duration: number;
		piece: Piece;
	}
}