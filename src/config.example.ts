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
	presence: { status: 'online', activity: { type: 'LISTENING', name: `${PREFIX}help` } }
};

export const TOKENS = {
	BOT_TOKEN: ''
};

export const PGSQL_ENABLED = false;
export const PGSQL_DATABASE_NAME = 'sapphire';
export const PGSQL_DATABASE_PASSWORD = '';
export const PGSQL_DATABASE_USER = '';
export const PGSQL_DATABASE_PORT = 5432;
export const PGSQL_DATABASE_HOST = 'localhost';
