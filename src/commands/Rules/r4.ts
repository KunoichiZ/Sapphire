import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { BrandingColors } from '#utils/Branding';

@ApplyOptions<CommandOptions>({
	category: 'Rules',
	description: 'Displays the fourth rule of the server'
})
export default class Rule4Command extends SapphireCommand {
	public run(message: Message) {
		const r4Embed = new MessageEmbed()
			.setTitle('Pokemon Crossroads Discord Rules')
			.setColor(BrandingColors.Primary)
			.addField(
				'Rule 4',
				"The only type of advertising we allow on this server is art, writing and other creative works in <#584930165612740609>. If you have something else you'd like to advertise, you can do that ONLY in this forum thread: [http://www.pokemoncrossroads.com/forum/showthread.php?1386-Website-Forum-Advertising](http://www.pokemoncrossroads.com/forum/showthread.php?1386-Website-Forum-Advertising)"
			);
		return message.channel.send(r4Embed);
	}
}
