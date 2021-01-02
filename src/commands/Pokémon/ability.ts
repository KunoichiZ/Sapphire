import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { fetchGraphQLPokemon, getAbilityDetailsByFuzzy, parseBulbapediaURL } from '#utils/Pokemon';
import { toTitleCase } from '@sapphire/utilities';
import { BrandingColors } from '#utils/Branding';

@ApplyOptions<CommandOptions>({
	aliases: ['abilities', 'pokeability'],
	category: 'Pokémon',
	description: 'Gets ability data for any given Pokémon'
})
export default class AbilityCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const ability = await args.rest('string');
		const abilityDetails = await this.fetchAPI(ability.toLowerCase());
		const externalResourceData = [
			`[Bulbapedia](${parseBulbapediaURL(abilityDetails.bulbapediaPage)} )`,
			`[Serebii](${abilityDetails.serebiiPage})`,
			`[Smogon](${abilityDetails.smogonPage})`
		].join(' | ');
		const embed = new MessageEmbed()
			.setColor(BrandingColors.Primary)
			.setAuthor(`Ability - ${toTitleCase(abilityDetails.name)}`, 'https://cdn.kunoichiz.me/cdn/images/dex.png')
			.setDescription(abilityDetails.desc || abilityDetails.shortDesc)
			.addField('External Resources', externalResourceData);

		if (abilityDetails.isFieldAbility) {
			embed.spliceFields(0, 0, { name: 'Effect outside of battle', value: abilityDetails.isFieldAbility, inline: false });
		}

		return message.channel.send(embed);
	}

	private async fetchAPI(ability: string) {
		try {
			const { data } = await fetchGraphQLPokemon<'getAbilityDetailsByFuzzy'>(getAbilityDetailsByFuzzy, { ability });
			return data.getAbilityDetailsByFuzzy;
		} catch (err) {
			throw err;
		}
	}
}
