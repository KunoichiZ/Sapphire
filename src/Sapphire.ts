import 'reflect-metadata';
import { Constants } from 'discord.js';
import { SBClient } from '#lib/SapphireClient';
import { POOL, PREFIX, TOKENS } from '#root/config';

const main = async () => {
	const client = new SBClient({
		defaultPrefix: PREFIX,
		presence: {
			activity: {
				name: 'the Battle Frontier',
				type: 'COMPETING'
			}
		}
	});

	await POOL.connect((err: any) => {
		if (err) throw err;
		console.log('Connected to PostgresSQL');
	});
	client.on(Constants.Events.DEBUG, console.debug);
	client.on(Constants.Events.CLIENT_READY, () => console.log(`${client.user?.tag} (${client.user?.id}) has logged in!`));
	return client.login(TOKENS.BOT_TOKEN);
};

main();
