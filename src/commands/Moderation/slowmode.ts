import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { getGuild } from '#utils/get';

@ApplyOptions<CommandOptions>({
	aliases: ['slow'],
	category: 'Moderation',
	description: 'Bans a member from the server',
	preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class BanCommand extends SapphireCommand {
    public async run(message: Message, args: Args) {
        const time = await args.pick('string');
        let duration;
        const channel = message.channel as TextChannel;
        // const channel = message.guild?.channels.cache.get(message.channel.id)
        let reason = await args.rest('string').catch(() => null);
        reason = reason !== null ? reason : 'No reason given by staff';
        const slowmodeEmbed = new MessageEmbed();
        const modlogsChannel = (await getGuild(message.guild?.id as string)).modlogschannel;
        const modLogsChannel = message.guild?.channels.cache.find(channel => channel.name === modlogsChannel) as TextChannel;

        if(time === 'off') {
            duration = 0;
            reason = 'Slowmode turned off'
            channel.setRateLimitPerUser(duration, reason)
        } else {
            duration = parseInt(time);
            channel.setRateLimitPerUser(duration, reason)
        }
        slowmodeEmbed
        .setColor(message.member?.displayHexColor as string)
        .addField('Slowmode Set', `${duration} seconds`)
        .addField('Reason', reason);

        message.channel.send(`Slowmode set to ${duration}, reason: ${reason}`);
        return modLogsChannel.send(slowmodeEmbed);

    }
}