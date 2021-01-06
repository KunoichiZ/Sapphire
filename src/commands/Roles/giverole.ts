import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import type { Message, Role } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
    aliases: ['give'],
    category: 'Roles',
	description: 'Gives the user the specified role'
})
export default class GiveRoleCommand extends SapphireCommand {
    public async run(message: Message, args: Args) {
        const roleResolvable = await args.pick('role');

        const role = message.guild?.roles.resolve(roleResolvable) as Role;
        const roles = ['Discord Staff', 'Administrator', 'Discord Senior Staff', 'Discord Regular Staff', 'Forum Staff', 'Forum Senior Administrator','Forum Administrator', 'Forum Senior Moderator','Forum Moderator', 'Sapphire', 'Sheriff Magnezone', 'Deputy Magnemite', 'ASB Staff', 'ASB Planner', 'Bot', 'Pokecord', 'MEE6','DISBOARD.org', 'Nitro Booster'];

        if(message.guild?.roles.cache.find(role => role === role)) {
            if(roles.includes(role.name)) {
                message.channel.send('You cannot give yourself one of those roles!');
            } else if(message.member?.roles.cache.has(role.id)) {
                message.channel.send(`You already have the \`${role.name}\` role!`);
            } else {
                message.member?.roles.add(role).catch(console.error);
                message.channel.send(`You've been given the \`${role.name}\` role!`);
            }
        } else {
            message.channel.send(`That role does not exist in this server!`);
        }
    }
}