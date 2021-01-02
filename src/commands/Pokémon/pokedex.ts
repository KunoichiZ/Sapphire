// import { AbilitiesEntry, DexDetails, GenderEntry, StatsEntry } from '@favware/graphql-pokemon';
// import { MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import type { AbilitiesEntry, DexDetails, GenderEntry, StatsEntry } from '@favware/graphql-pokemon';
import { fetchGraphQLPokemon, getPokemonDetailsByFuzzy, parseBulbapediaURL, resolveColor } from '#utils/Pokemon';
import SapphireCommand from '#lib/SapphireCommand';
import { toTitleCase } from '@sapphire/utilities';

enum BaseStats {
	hp = 'HP',
	attack = 'ATK',
	defense = 'DEF',
	specialattack = 'SPA',
	specialdefense = 'SPD',
	speed = 'SPE'
}

@ApplyOptions<CommandOptions>({
	aliases: ['dex', 'pokemon', 'mon', 'poke', 'dexter'],
	category: 'Pokemon',
	description: 'Gets data for any given Pokémon'
})
export default class PokedexCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const pokemon = await args.rest('string');
		const pokeDetails = await this.fetchAPI(pokemon.toLowerCase());
		return message.channel.send(this.buildDisplay(message, pokeDetails));
	}

	private async fetchAPI(pokemon: string) {
		try {
			const { data } = await fetchGraphQLPokemon<'getPokemonDetailsByFuzzy'>(getPokemonDetailsByFuzzy, { pokemon });
			return data.getPokemonDetailsByFuzzy;
		} catch (err) {
			throw err;
		}
	}

	private buildDisplay(message: Message, pokeDetails: DexDetails) {
		const abilities = this.getAbilities(pokeDetails.abilities);
		const baseStats = this.getBaseStats(pokeDetails.baseStats);
		const evoChain = this.getEvoChain(pokeDetails);

		return this.parseRegularPokemon({ message, pokeDetails, abilities, baseStats, evoChain });
	}

	private constructEvoLink(species: DexDetails['species'], level: DexDetails['evolutionLevel'], evoChain: string, isEvo = true) {
		if (isEvo) {
			return `${evoChain} → \`${toTitleCase(species)}\` ${level ? `(${level})` : ''}`;
		}
		return `\`${toTitleCase(species)}\` ${level ? `(${level})` : ''} → ${evoChain}`;
	}

	private parseGenderRatio(genderRatio: GenderEntry) {
		if (genderRatio.male === '0%' && genderRatio.female === '0%') {
			return 'Genderless';
		}

		return `${genderRatio.male} ♂ | ${genderRatio.female} ♀`;
	}

	private getAbilities(abilitiesData: AbilitiesEntry): string[] {
		const abilities: string[] = [];
		for (const [type, ability] of Object.entries(abilitiesData)) {
			if (!ability) continue;
			abilities.push(type === 'hidden' ? `*${ability}*` : ability);
		}

		return abilities;
	}

	private getBaseStats(statsData: StatsEntry): string[] {
		const baseStats: string[] = [];
		for (const [stat, value] of Object.entries(statsData)) {
			baseStats.push(`${BaseStats[stat as keyof Omit<StatsEntry, '__typename'>]}: **${value}**`);
		}

		return baseStats;
	}

	private getEvoChain(pokeDetails: DexDetails): string {
		// Set evochain if there are no evolutions
		let evoChain = `**${toTitleCase(pokeDetails.species)} ${pokeDetails.evolutionLevel ? `(${pokeDetails.evolutionLevel})` : ''}**`;
		if (!pokeDetails.evolutions?.length && !pokeDetails.preevolutions?.length) {
			evoChain += ' (No Evolutions)';
		}

		// Parse pre-evolutions and add to evochain
		if (pokeDetails.preevolutions?.length) {
			const { evolutionLevel } = pokeDetails.preevolutions[0];
			evoChain = this.constructEvoLink(pokeDetails.preevolutions[0].species, evolutionLevel, evoChain, false);

			// If the direct pre-evolution has another pre-evolution (charizard -> charmeleon -> charmander)
			if (pokeDetails.preevolutions[0].preevolutions?.length) {
				evoChain = this.constructEvoLink(pokeDetails.preevolutions[0].preevolutions[0].species, null, evoChain, false);
			}
		}

		// Parse evolution chain and add to evochain
		if (pokeDetails.evolutions?.length) {
			evoChain = this.constructEvoLink(pokeDetails.evolutions[0].species, pokeDetails.evolutions[0].evolutionLevel, evoChain);

			// In case there are multiple evolutionary paths
			const otherFormeEvos = pokeDetails.evolutions.slice(1);
			if (otherFormeEvos.length) {
				evoChain = `${evoChain}, ${otherFormeEvos.map((oevo) => `\`${oevo.species}\` (${oevo.evolutionLevel})`).join(', ')}`;
			}

			// If the direct evolution has another evolution (charmander -> charmeleon -> charizard)
			if (pokeDetails.evolutions[0].evolutions?.length) {
				evoChain = this.constructEvoLink(
					pokeDetails.evolutions[0].evolutions[0].species,
					pokeDetails.evolutions[0].evolutions[0].evolutionLevel,
					evoChain
				);
			}
		}

		return evoChain;
	}

	private parseRegularPokemon({ pokeDetails, abilities, baseStats, evoChain }: PokemonToDisplayArgs) {
		const externalResourceData = [
			`[Bulbapedia](${parseBulbapediaURL(pokeDetails.bulbapediaPage)} )`,
			`[Serebii](${pokeDetails.serebiiPage})`,
			`[Smogon](${pokeDetails.smogonPage})`
		].join(' | ');

		const display = new MessageEmbed()
			.setColor(resolveColor(pokeDetails.color))
			.setAuthor(`#${pokeDetails.num} - ${toTitleCase(pokeDetails.species)}`, 'https://cdn.kunoichiz.me/cdn/images/dex.png')
			.setThumbnail(pokeDetails.sprite)
			.addField('Types', pokeDetails.types.join(', '), true)
			.addField('Abilities', abilities.join(', '), true)
			.addField('Gender Ratio', this.parseGenderRatio(pokeDetails.gender), true)
			.addField('Evolution Chain', evoChain)
			.addField('Base Stats', `${baseStats.join(', ')} (*Base Stat Total*: **${pokeDetails.baseStatsTotal}**)`)
			.addField('Height', `${pokeDetails.height}m`, true)
			.addField('Weight', `${pokeDetails.weight}kg`, true)
			.addField('Egg Groups', pokeDetails.eggGroups?.join(', ') || '', true)
			.addField('Smogon Tier', pokeDetails.smogonTier, true)
			.addField('Flavor Texts', `\`(${pokeDetails.flavorTexts[0].game})\` ${pokeDetails.flavorTexts[0].flavor}`)
			.addField('External Resources', externalResourceData);

		return display;
	}
}

interface PokemonToDisplayArgs {
	message: Message;
	pokeDetails: DexDetails;
	abilities: string[];
	baseStats: string[];
	evoChain: string;
}
