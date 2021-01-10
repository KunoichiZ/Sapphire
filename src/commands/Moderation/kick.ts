import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { getGuild } from '#utils/get';

@ApplyOptions<CommandOptions>({
	aliases: ['k'],
	category: 'Moderation',
	description: 'Kicks a member from the server',
	preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class KickCommand extends SapphireCommand {
    public async run(message: Message, args: Args) {
		const user = await args.pick('user');
		if (!user) throw '**User not provided.** Users can be either an id or mention.';
        const member = await message.guild!.members.fetch(user?.id).catch(() => null);
		if (!member) throw '**Member not found.** Please make sure the user is in this guild.';
        if (member.id === message.author.id) return message.reply('I don\'t think you want to ban yourself.');
        if (!member.kickable) return message.reply('I cannot ban that member, their role is probably higher than my own!');

        let reason = await args.rest('string').catch(() => null);
        reason = reason !== null ? reason : 'No reason given by staff';

		if (reason && reason.length > 1000) throw 'Reason maximum char length is 1000.';
        member.kick(reason)

		const modlogsChannel = (await getGuild(message.guild?.id as string)).modlogsChannel;
        let channel = message.guild?.channels.cache.find(channel => channel.name === modlogsChannel) as TextChannel;
        const kickEmbed = new MessageEmbed()
        .setColor(message.member?.displayHexColor as string)
        .setDescription(`
          **Member:** ${member.user.tag} (${member.id})\n
          **Action:** Kick\n
          **Reason:** ${reason}`
        );
    
        message.channel.send(`Successfully kicked ${member.user.tag} (${member.id}, reason: ${reason}`);
        return channel.send(kickEmbed);
    }
}