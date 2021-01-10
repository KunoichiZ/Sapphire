import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import WarnEntity from '#orm/entities/WarnEntity';
import type UserEntity from '#orm/entities/UserEntity';
import { getGuild } from '#utils/get';
import { BrandingColors } from '#utils/Branding';
import { cast } from '#utils/cast';
import { CLIENT_ID, OWNER_ID } from '#root/config';

@ApplyOptions<CommandOptions>({
    category: 'Moderation',
    description: 'Warn a user in the guild.',
    preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class WarnCommand extends SapphireCommand {
    public async run(message: Message, args: Args) {
        const user = await args.pick('user');
		if (!user) message.channel.send('**User not provided.** Users can be either an id or mention.');
        if ([...OWNER_ID, CLIENT_ID, message.author.id].includes(user.id)) message.channel.send('Unable to use moderation actions on this user.');
        const member = await message.guild!.members.fetch(user?.id).catch(() => null);
		if (!member) message.channel.send('**Member not found.** Please make sure the user is in this guild.');

		const guild = await getGuild(message.guild?.id as string);

        const reason = await args.rest('string').catch(() => null);

		if (reason && reason.length > 1000) message.channel.send('Reason maximum char length is 1000.');

        const warn = new WarnEntity;
        warn.member = cast<UserEntity>(member);
        warn.id = message.guild?.id as string;
        warn.caseID = await guild.increaseTotalCases();
        warn.guild = guild;
        warn.reason = reason;
        guild.warns = Object.values(warn);
        guild.totalwarns = await guild.increaseTotalCases();
        await warn.save();
        await guild.save();
        console.log(warn.caseID);

        const modLogsChannel = (await getGuild(message.guild?.id as string)).modlogsChannel;
		let modlogsChannel = message.guild?.channels.cache.find(channel => channel.name === modLogsChannel) as TextChannel;

        modlogsChannel.send(
            new MessageEmbed()
                .setColor(BrandingColors.Primary)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setDescription([`**Action**: Warn`, `**User**: ${user.tag} (${user.id})`, `**Reason**: ${reason || 'No reason was provided.'}`])
                .setFooter(`Warn Case ${warn.caseID}`, this.context.client.user!.displayAvatarURL())
                .setTimestamp()
        );
    }
}