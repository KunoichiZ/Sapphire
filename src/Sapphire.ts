import 'reflect-metadata';
import { Constants } from 'discord.js';
import { SBClient } from '#lib/SapphireClient';
import { DEV, DEV_PREFIX, POOL, PREFIX, TOKENS } from '#root/config';

const main = async () => {
	const client = new SBClient({
		defaultPrefix: DEV ? DEV_PREFIX : PREFIX,
		presence: {
			activity: {
				name: 'the Battle Frontier',
				type: 'COMPETING'
			}
		}
	});
	if (DEV) {
		client.on(Constants.Events.DEBUG, console.debug);
		client.on(Constants.Events.CLIENT_READY, () => console.log(`${client.user?.tag} (${client.user?.id}) has logged in!`));
		client.login(TOKENS.DEV_BOT_TOKEN);
	} else {
		await POOL.connect((err: any) => {
			if (err) throw err;
			console.log('Connected to PostgresSQL');
			client.on(Constants.Events.DEBUG, console.debug);
			client.on(Constants.Events.CLIENT_READY, () => console.log(`${client.user?.tag} (${client.user?.id}) has logged in!`));
			client.login(TOKENS.BOT_TOKEN);
		});
	}
};

main();
