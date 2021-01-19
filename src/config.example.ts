import type { ClientOptions } from 'discord.js';
import { Pool } from 'pg';

export const NAME = '';
export const PREFIX = '';
export const OWNER_ID = '';
export const CLIENT_ID = '';
export const CLIENT_SECRET = '';

export const DEV_NAME = '';
export const DEV_PREFIX = '';
export const DEV_CLIENT_ID = '';
export const DEV_CLIENT_SECRET = '';

export const CLIENT_OPTIONS: ClientOptions = {
	messageCacheLifetime: 120,
	messageCacheMaxSize: 20,
	messageEditHistoryMaxSize: 0,
	presence: { status: 'online', activity: { type: 'LISTENING', name: `${PREFIX}help` } }
};

export const TOKENS = {
	BOT_TOKEN: '',
	DEV_BOT_TOKEN: ''
};

export const PGSQL_ENABLED = false;
export const PGSQL_DATABASE_NAME = 'sapphire';
export const PGSQL_DATABASE_PASSWORD = '';
export const PGSQL_DATABASE_USER = '';
export const PGSQL_DATABASE_PORT = 5432;
export const PGSQL_DATABASE_HOST = 'localhost';

export const PGSQL_DATABASE_URL = `postgresql://${PGSQL_DATABASE_USER}:${PGSQL_DATABASE_PASSWORD}@${PGSQL_DATABASE_HOST}:${PGSQL_DATABASE_PORT}/${PGSQL_DATABASE_NAME}`;

export const POOL = new Pool({
	connectionString: PGSQL_DATABASE_URL,
	port: PGSQL_DATABASE_PORT,
	host: PGSQL_DATABASE_HOST,
	database: PGSQL_DATABASE_NAME,
	user: PGSQL_DATABASE_USER,
	password: PGSQL_DATABASE_PASSWORD
});
