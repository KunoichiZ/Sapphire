/* eslint-disable no-else-return */
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { POOL, PREFIX } from '#root/config';

@ApplyOptions<CommandOptions>({
	fullCategory: ['Owner'],
	description: 'Adds the server to the database',
	preconditions: ['OwnerOnly']
})
export default class CreateCommand extends SapphireCommand {
	public run(message: Message) {
		const guildID = message.guild?.id;
		const selectQuery = `SELECT id FROM guilds WHERE id=${guildID}`;
		const insertIntoQuery = {
			text: 'INSERT INTO guilds (id, prefix, quotechannel, announcementchannel, modlogsChannel) VALUES($1, $2, $3, $4, $5)',
			values: [guildID, PREFIX, '', '', '']
		};
		// callback
		POOL.query(selectQuery, (err, res) => {
			if (err) {
				return console.log(err.stack);
			} else if (res.rows[0] === undefined) {
				POOL.query(insertIntoQuery, (err, res) => {
					if (err) {
						return console.log(err.stack);
					} else {
						console.log(res.rows[0]);
						return message.channel.send(`Successfully created a row with ID of ${guildID} and prefix of ${PREFIX}`);
					}
				});
			} else {
				return message.channel.send('Row already created');
			}
		});
		// return message.channel.send('test message working!');
	}
}
