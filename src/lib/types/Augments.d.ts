declare module 'discord.js' {
	interface Client {
		readonly version: string;
		readonly invite: string;
    }
}