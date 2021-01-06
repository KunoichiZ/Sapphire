import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import UserEntity from '#orm/entities/UserEntity';

@ApplyOptions<CommandOptions>({
    category: 'Friend Code',
	description: 'Gets a Nintendo Switch FC'
})
export default class FindSwitchFCCommand extends SapphireCommand {
    public async run(message: Message, args: Args) {
        const user = await args.pick('user');
		let member = await message.guild!.members.fetch(user?.id).catch(() => null);
        let userSettings = await this.getUser(user?.id as string);
        const fcEmbed = new MessageEmbed();
        let switchFC = userSettings.switchFC;
        let goFC = userSettings.goFC;
        if(member?.id === message.author.id) {
            userSettings = await this.getUser(message.author.id as string);
            member = await message.guild!.members.fetch(message.author.id).catch(() => null);
            switchFC = userSettings.switchFC;
            goFC = userSettings.goFC;
            fcEmbed
                .setColor(message.member?.displayHexColor as string)
                .setAuthor(member?.user.tag, member?.user.displayAvatarURL())
                .setTitle('**Friend Code(s) Found**')
                .addField('Switch Friend Code', switchFC)
            if(goFC !== '') {
                fcEmbed.addField('Pokémon Go Friend Code', goFC);
            }
            return message.channel.send(fcEmbed);
        } else if(userSettings.switchFC) {
            switchFC = userSettings.switchFC;
            goFC = userSettings.goFC;
            console.log(goFC);
            fcEmbed
                .setColor(message.member?.displayHexColor as string)
                .setAuthor(member?.user.tag, member?.user.displayAvatarURL())
                .setTitle('**Friend Code(s) Found**')
                .addField('Switch Friend Code', switchFC)
            if(goFC !== '') {
                fcEmbed.addField('Pokémon Go Friend Code', goFC);
            }
            return message.channel.send(fcEmbed);
        } else {
            return message.channel.send('Member is not in the database!')
        }
    }

    async getUser(id: string): Promise<UserEntity> {
        const user = await UserEntity.findOne({ id });
        if (user) return user;
        return UserEntity.create({ id }).save();
    }
}