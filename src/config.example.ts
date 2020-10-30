import { ClientOptions } from 'discord.js';

export const PREFIX = '-';
export const OWNER_ID = '';

export const CLIENT_OPTIONS: ClientOptions = {
	defaultPrefix: PREFIX,
	messageCacheLifetime: 120,
	messageCacheMaxSize: 20,
	messageEditHistoryMaxSize: 0,
	presence: { status: 'online', activity: { type: 'LISTENING', name: `${PREFIX}help` } },
};

export const TOKENS = {
	BOT_TOKEN: ''
};