import 'reflect-metadata';
// import { connect } from '#lib/orm/ormConfig';
import { SBClient } from '#lib/SapphireClient';
import { PREFIX, TOKENS } from '#root/config';

const main = async () => {
	const client = new SBClient({
		defaultPrefix: PREFIX,
		presence: {
			activity: {
				name: 'Pokémon Emerald',
				type: 'STREAMING'
			}
		}
	});

	try {
		// await connect();
		await client.login(TOKENS.BOT_TOKEN);
	} catch (error) {
		client.logger.error(error);
	}
};

main();
