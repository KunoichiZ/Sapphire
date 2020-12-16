import GuildSettingsEntity from '../orm/entities/GuildSettings';

declare module 'discord.js' {
	interface Client {
		readonly version: string;
        readonly invite: string;
        settingsCache: Map<string, GuildSettingsEntity>;
        fetchGuildPrefix(guild: Guild): Promise<string>;
    }
}