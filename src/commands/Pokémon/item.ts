import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { toTitleCase } from '@sapphire/utilities';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { fetchGraphQLPokemon, getItemDetailsByFuzzy, parseBulbapediaURL } from '#utils/Pokemon';
import { BrandingColors } from '#utils/Branding';

@ApplyOptions<CommandOptions>({
	aliases: ['pokeitem', 'bag'],
	fullCategory: ['Pokémon'],
	description: 'Gets data for any given Pokémon item'
})
export default class ItemCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const item = await args.rest('string');
		const itemDetails = await this.fetchAPI(item.toLowerCase());
		const externalResourceData = [
			`[Bulbapedia](${parseBulbapediaURL(itemDetails.bulbapediaPage)} )`,
			`[Serebii](${itemDetails.serebiiPage})`,
			`[Smogon](${itemDetails.smogonPage})`
		].join(' | ');
		return message.channel.send(
			new MessageEmbed()
				.setColor(BrandingColors.Primary)
				.setAuthor(`Item - ${toTitleCase(itemDetails.name)}`, 'https://cdn.kunoichiz.me/cdn/images/dex.png')
				.setThumbnail(itemDetails.sprite)
				.setDescription(itemDetails.desc)
				.addField('Generation Introduced', itemDetails.generationIntroduced, true)
				.addField('Available in Generation 8', itemDetails.isNonstandard === 'Past' ? 'No' : 'Yes', true)
				.addField('External Resources', externalResourceData)
		);
	}

	private async fetchAPI(item: string) {
		try {
			const { data } = await fetchGraphQLPokemon<'getItemDetailsByFuzzy'>(getItemDetailsByFuzzy, { item });
			return data.getItemDetailsByFuzzy;
		} catch (err) {
			throw err;
		}
	}
}
