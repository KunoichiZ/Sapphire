import 'reflect-metadata';
import { SBClient } from '#lib/SapphireClient';
import { PREFIX, TOKENS } from '#root/config';
import { Constants } from 'discord.js';

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

	try {
		await client.login(TOKENS.BOT_TOKEN);
		client.on(Constants.Events.DEBUG, console.debug);
		client.on(Constants.Events.CLIENT_READY, () => console.log(`${client.user?.tag} (${client.user?.id}) has logged in!`));
	} catch (error) {
		client.logger.error(error);
	}
};

main();
