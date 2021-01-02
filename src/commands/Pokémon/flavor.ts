import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { toTitleCase } from '@sapphire/utilities';
import type { DexDetails } from '@favware/graphql-pokemon';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { fetchGraphQLPokemon, getPokemonFlavorTextsByFuzzy, resolveColor } from '#utils/Pokemon';

@ApplyOptions<CommandOptions>({
	aliases: ['flavors', 'dexentries', 'dexentry'],
	category: 'Pokémon',
	description: 'Gets ability data for any given Pokémon'
})
export default class AbilityCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const pokemon = await args.rest('string');
		const pokemonData = await this.fetchAPI(pokemon.toLowerCase());
		return message.channel.send(this.buildDisplay(pokemonData));
	}

	private async fetchAPI(pokemon: string) {
		try {
			const { data } = await fetchGraphQLPokemon<'getPokemonDetailsByFuzzy'>(getPokemonFlavorTextsByFuzzy, { pokemon });
			return data.getPokemonDetailsByFuzzy;
		} catch (err) {
			throw err;
		}
	}

	private buildDisplay(pokemonData: DexDetails) {
		const display = new MessageEmbed()
			.setColor(resolveColor(pokemonData.color))
			.setAuthor(`#${pokemonData.num} - ${toTitleCase(pokemonData.species)}`, 'https://cdn.kunoichiz.me/cdn/images/dex.png')
			.setThumbnail(pokemonData.sprite);

		for (const flavorText of pokemonData.flavorTexts) {
			display.addField(`**${flavorText.game}**`, flavorText.flavor);
		}

		return display;
	}
}
