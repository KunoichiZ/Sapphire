/* eslint-disable no-negated-condition */
import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import type { Message, Role } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['give'],
	category: 'Roles',
	description: 'Remove the specified role from the user'
})
export default class RemoveRoleCommand extends SapphireCommand {
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
				message.channel.send('You cannot remove one of those roles!');
			} else if (!message.member?.roles.cache.has(roleName.id)) {
				message.channel.send(`You do not have that role!`);
			} else {
				message.member?.roles.remove(roleName).catch(console.error);
				message.channel.send(`The \`${roleName.name}\` role has been removed!`);
			}
		} else {
			message.channel.send(`That role does not exist in this server!`);
		}
	}
}
