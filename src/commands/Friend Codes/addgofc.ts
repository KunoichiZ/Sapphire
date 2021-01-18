/* eslint-disable no-negated-condition */
import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { POOL } from '#root/config';

@ApplyOptions<CommandOptions>({
	category: 'Friend Codes',
	description: 'Sets your Pokémon GO FC'
})
export default class AddGoFCCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const goFC = await args.restResult('string');

		const id = message.author.id as string;
		const selectQuery = `SELECT id FROM users WHERE id=${id}`;
		const updateQuery = `UPDATE users SET gofc = '${goFC.value}' WHERE id = ${id}`;
		if (!goFC.success) {
			message.channel.send(`You did not add a Pokémon GO FC!`);
		} else {
			POOL.query(selectQuery, (err, res) => {
				if (err) {
					console.log(err.stack);
				} else if (res.rows[0].gofc === undefined) {
					POOL.query(updateQuery, (err) => {
						if (err) {
							console.log(err.stack);
						} else {
							message.channel.send(`Your Pokémon GO been set to: ${goFC.value}`);
						}
					});
				} else {
					message.channel.send("You've already added a Pokémon GO FC!");
				}
			});
		}
	}
}
