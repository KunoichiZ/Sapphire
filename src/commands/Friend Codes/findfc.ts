import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { getUser } from '#utils/get';

@ApplyOptions<CommandOptions>({
    category: 'Friend Code',
	description: 'Gets a Nintendo Switch FC'
})
export default class FindSwitchFCCommand extends SapphireCommand {
    public async run(message: Message, args: Args) {
        const user = await args.pick('user').catch(() => null);
        let member;
        let userSettings;
        const fcEmbed = new MessageEmbed();
        let switchFC = '';
        let goFC = '';
        if(user === null) {
            userSettings = await getUser(message.author.id as string);
            member = await message.guild!.members.fetch(message.author.id);
            switchFC = userSettings.switchFC;
            goFC = userSettings.goFC;
            fcEmbed
                .setColor(message.member?.displayHexColor as string)
                .setAuthor(member?.user.tag, member?.user.displayAvatarURL())
                .setTitle('**Friend Code(s) Found**')
                .addField('Switch Friend Code', switchFC)
            if(goFC !== null) {
                fcEmbed.addField('Pokémon Go Friend Code', goFC);
            }
            return message.channel.send(fcEmbed);
        } else if(user.id != message.author.id){
            member = await message.guild!.members.fetch(user.id);
            userSettings = await getUser(user.id as string);
            switchFC = userSettings.switchFC;
            goFC = userSettings.goFC;
            if(switchFC === 'NULL') {
                switchFC = 'No friend code added'
                fcEmbed
                .setColor(message.member?.displayHexColor as string)
                .setAuthor(member?.user.tag, member?.user.displayAvatarURL())
                .setTitle('**Friend Code(s) Found**')
                .addField('Switch Friend Code', switchFC)
            } else {
                fcEmbed
                .setColor(message.member?.displayHexColor as string)
                .setAuthor(member?.user.tag, member?.user.displayAvatarURL())
                .setTitle('**Friend Code(s) Found**')
                .addField('Switch Friend Code', switchFC)
            }
            if(goFC !== 'NULL') {
                fcEmbed.addField('Pokémon Go Friend Code', goFC);
            }
            return message.channel.send(fcEmbed);
        } else {
            return message.channel.send('Member is not in the database!');
        }
    }
}