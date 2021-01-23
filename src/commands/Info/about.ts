import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { BrandingColors, Character, Team, AtSea, Relatives, Released, Borrowed, Befriended } from '#utils/Branding';

@ApplyOptions<CommandOptions>({
	fullCategory: ['Info'],
	description: "Shows you useful information about the bot's character."
})
export default class AboutCommand extends SapphireCommand {
	public async run(message: Message) {
		const avatarURL = this.context.client.user?.displayAvatarURL({ format: 'png' }) as string;
		const aboutEmbed = new MessageEmbed()
			.setColor(BrandingColors.Primary)
			.setThumbnail(avatarURL)
			.setDescription(
				'Sapphire Birch (Japanese: オダマキ・サファイア Sapphire Odamaki) is a main character in the manga series Pokémon Adventures.'
			)
			.addField('Gender', Character.Gender, true)
			.addField('Birthday', Character.Birthday, true)
			.addField('Age', Character.Age, true)
			.addField('Hair Color', Character.HairColor, true)
			.addField('Eye Color', Character.EyeColor, true)
			.addField('Hometown', Character.Hometown, true)
			.addField('Blood Type', Character.BloodType, true)
			.addField('Height', Character.Height, true)
			.addField('Weight', Character.Weight, true)
			.addField('Title', Character.Title, true)
			.addField('Trainer Class', Character.TrainerClass, true)
			.addField('Relatives', Relatives.join(', '), true)
			.addField('Team', Team.join(', '))
			.addField('AtSea', AtSea.join(', '))
			.addField('Released', Released.join(', '))
			.addField('Borrowed', Borrowed.join(', '))
			.addField('Befriended', Befriended.join(', '));

		return message.channel.send(aboutEmbed);
	}
}
