import { ClientOptions } from 'discord.js';

export const NAME = '';
export const PREFIX = '';
export const OWNER_ID = '';
export const CLIENT_ID = '';
export const CLIENT_SECRET = '';

export const CLIENT_OPTIONS: ClientOptions = {
	messageCacheLifetime: 120,
	messageCacheMaxSize: 20,
	messageEditHistoryMaxSize: 0,
	presence: { status: 'online', activity: { type: 'LISTENING', name: `${PREFIX}help` } },
};

export const TOKENS = {
	BOT_TOKEN: ''
};