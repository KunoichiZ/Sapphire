import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { toTitleCase } from '@sapphire/utilities';
import type { DexDetails } from '@favware/graphql-pokemon';
import { MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { UserPaginatedMessage } from '#lib/structures/UserPaginatedMessage';
import type { GuildMessage } from '#lib/types';
import { fetchGraphQLPokemon, getPokemonFlavorTextsByFuzzy, resolveColor } from '#utils/Pokemon';

@ApplyOptions<CommandOptions>({
	aliases: ['flavors', 'dexentries', 'dexentry'],
	fullCategory: ['Pokémon'],
	description: 'Gets dex entry data for any given Pokémon'
})
export default class FlavorCommand extends SapphireCommand {
	public async run(message: GuildMessage, args: Args) {
		const pokemon = await args.rest('string');

		const pokemonData = await this.fetchAPI(pokemon.toLowerCase());

		const display = await this.buildDisplay(pokemonData) //
			.start(message, message.author);
		return display;
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
		const display = new UserPaginatedMessage({
			template: new MessageEmbed()
				.setColor(resolveColor(pokemonData.color))
				.setAuthor(`#${pokemonData.num} - ${toTitleCase(pokemonData.species)}`, 'https://cdn.kunoichiz.me/cdn/images/dex.png')
				.setThumbnail(pokemonData.sprite)
		});

		for (const flavorText of pokemonData.flavorTexts) {
			display.addPageEmbed((embed) => embed.setDescription([`**${flavorText.game}**`, flavorText.flavor].join('\n')));
		}

		return display;
	}
}
