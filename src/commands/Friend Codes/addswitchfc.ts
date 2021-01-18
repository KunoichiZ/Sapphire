/* eslint-disable no-negated-condition */
/* eslint-disable no-else-return */
import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { POOL } from '#root/config';

@ApplyOptions<CommandOptions>({
	category: 'Friend Codes',
	description: 'Sets your Nintendo Switch FC'
})
export default class AddSwitchFCCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const switchFC = await args.restResult('string');

		const id = message.author.id as string;
		const selectQuery = `SELECT id FROM users WHERE id=${id}`;
		const insertIntoQuery = {
			text: 'INSERT INTO users(id) VALUES($1)',
			values: [id]
		};
		const updateQuery = `UPDATE users SET switchfc = '${switchFC.value}' WHERE id = ${id}`;
		if (!switchFC.success) {
			message.channel.send(`You did not add a Nintendo Switch FC!`);
		} else {
			POOL.query(selectQuery, (err, res) => {
				if (err) {
					console.log(err.stack);
				} else if (res.rows[0] === undefined) {
					POOL.query(insertIntoQuery);
					POOL.query(updateQuery, (err) => {
						if (err) {
							console.log(err.stack);
						} else {
							message.channel.send(`Your Nintendo Switch FC been set to: ${switchFC.value}`);
						}
					});
				} else {
					message.channel.send("You've already added a Nintendo Switch FC!");
				}
			});
		}
	}
}
