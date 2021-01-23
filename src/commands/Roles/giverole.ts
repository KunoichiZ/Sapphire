/* eslint-disable no-self-compare */
import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import type { Message, Role } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['give'],
	fullCategory: ['Roles'],
	description: 'Gives the user the specified role'
})
export default class GiveRoleCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const roleResolvable = await args.pick('role');

		const roleName = message.guild?.roles.resolve(roleResolvable) as Role;
		const roles = [
			'Discord Staff',
			'Administrator',
			'Discord Senior Staff',
			'Discord Regular Staff',
			'Forum Staff',
			'Forum Senior Administrator',
			'Forum Administrator',
			'Forum Senior Moderator',
			'Forum Moderator',
			'Sapphire',
			'Sheriff Magnezone',
			'Deputy Magnemite',
			'ASB Staff',
			'ASB Planner',
			'Bot',
			'Pokecord',
			'MEE6',
			'DISBOARD.org',
			'Nitro Booster'
		];

		if (message.guild?.roles.cache.find((role) => role === roleName)) {
			if (roles.includes(roleName.name)) {
				message.channel.send('You cannot give yourself one of those roles!');
			} else if (message.member?.roles.cache.has(roleName.id)) {
				message.channel.send(`You already have the \`${roleName.name}\` role!`);
			} else {
				message.member?.roles.add(roleName).catch(console.error);
				message.channel.send(`You've been given the \`${roleName.name}\` role!`);
			}
		} else {
			message.channel.send(`That role does not exist in this server!`);
		}
	}
}
