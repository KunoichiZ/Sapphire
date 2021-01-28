/* eslint-disable no-else-return */
import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { POOL } from '#root/config';

@ApplyOptions<CommandOptions>({
	fullCategory: ['Friend Codes'],
	description: 'Gets the Friend Code from the specified user'
})
export default class FindSwitchFCCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const user = await args.pick('user').catch(() => null);
		console.log(user);
		const fcEmbed = new MessageEmbed();
		let switchFC = '';
		let goFC = '';
		if (user === null) {
			const id = message.author.id as string;
			const member = await message.guild!.members.fetch(message.author.id);
			const selectQuery = `SELECT id, switchfc, gofc FROM users WHERE id=${id}`;
			POOL.query(selectQuery, (err, res) => {
				if (err) {
					return console.log(err.stack);
				} else {
					switchFC = res.rows[0].switchfc;
					goFC = res.rows[0].gofc;
					if (switchFC === 'NULL') {
						switchFC = 'No friend code added';
					}
					fcEmbed
						.setColor(message.member?.displayHexColor as string)
						.setAuthor(member?.user.tag, member?.user.displayAvatarURL())
						.setTitle('**Friend Code(s) Found**')
						.addField('Switch Friend Code', switchFC);
					if (goFC !== 'NULL') {
						fcEmbed.addField('Pokémon Go Friend Code', goFC);
					}
					return message.channel.send(fcEmbed);
				}
			});
		} else if (user?.id !== message.author.id) {
			const userID = user?.id as string;
			const member = await message.guild!.members.fetch(userID);
			const selectQuery = `SELECT id, switchfc, gofc FROM users WHERE id=${userID}`;
			POOL.query(selectQuery, (err, res) => {
				if (err) {
					return console.log(err.stack);
				} else {
					console.log(res.rows[0]);

					if (res.rows[0] === undefined) {
						switchFC = 'No friend code added';
						fcEmbed
							.setColor(message.member?.displayHexColor as string)
							.setAuthor(member?.user.tag, member?.user.displayAvatarURL())
							.setTitle('**Friend Code(s) Found**')
							.addField('Switch Friend Code', switchFC);
						return message.channel.send(fcEmbed);
					} else {
						switchFC = res.rows[0].switchfc;
						goFC = res.rows[0].gofc;
						fcEmbed
							.setColor(message.member?.displayHexColor as string)
							.setAuthor(member?.user.tag, member?.user.displayAvatarURL())
							.setTitle('**Friend Code(s) Found**')
							.addField('Switch Friend Code', switchFC);
						if (goFC !== 'NULL') {
							fcEmbed.addField('Pokémon Go Friend Code', goFC);
						}
						return message.channel.send(fcEmbed);
					}
				}
			});
		}
	}
}
