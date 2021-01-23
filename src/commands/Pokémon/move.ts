import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { toTitleCase } from '@sapphire/utilities';
import type { MoveEntry } from '@favware/graphql-pokemon';
import { MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { UserPaginatedMessage } from '#lib/structures/UserPaginatedMessage';
import type { GuildMessage } from '#lib/types';
import { BrandingColors } from '#utils/Branding';
import { fetchGraphQLPokemon, getMoveDetailsByFuzzy, parseBulbapediaURL } from '#utils/Pokemon';

@ApplyOptions<CommandOptions>({
	fullCategory: ['Pokémon'],
	description: 'Gets data for any given Pokémon move'
})
export default class MoveCommand extends SapphireCommand {
	public async run(message: GuildMessage, args: Args) {
		const move = await args.rest('string');
		const moveData = await this.fetchAPI(move.toLowerCase());

		const display = await this.buildDisplay(moveData);

		return display.start(message, message.author);
	}

	private async fetchAPI(move: string) {
		try {
			const { data } = await fetchGraphQLPokemon<'getMoveDetailsByFuzzy'>(getMoveDetailsByFuzzy, { move });
			return data.getMoveDetailsByFuzzy;
		} catch (err) {
			throw err;
		}
	}

	private async buildDisplay(moveData: MoveEntry) {
		const externalSources = [
			`[Bulbapedia](${parseBulbapediaURL(moveData.bulbapediaPage)} )`,
			`[Serebii](${moveData.serebiiPage})`,
			`[Smogon](${moveData.smogonPage})`
		].join(' | ');

		const display = new UserPaginatedMessage({
			template: new MessageEmbed()
				.setColor(BrandingColors.Primary)
				.setAuthor(`Move - ${toTitleCase(moveData.name)}`, 'https://cdn.kunoichiz.me/cdn/images/dex.png')
				.setDescription(moveData.desc || moveData.shortDesc)
		})
			.addPageEmbed((embed) => {
				if (moveData.isFieldMove) {
					embed.addField('Effect outside of battle', moveData.isFieldMove, false);
				}

				return embed
					.addField('Type', moveData.type, true)
					.addField('Base Power', moveData.basePower, true)
					.addField('PP', moveData.pp, true)
					.addField('Accuracy', `${moveData.accuracy}%`, true)
					.addField('External Resources', externalSources);
			})
			.addPageEmbed((embed) =>
				embed
					.addField('Category', moveData.category, true)
					.addField('Priority', moveData.priority, true)
					.addField('Target', moveData.target, true)
					.addField('Contest Condition', moveData.contestType ?? 'None', true)
					.addField('External Resources', externalSources)
			);

		// If the move has zMovePower or maxMovePower then squeeze it in between as a page
		if (moveData.zMovePower || moveData.maxMovePower) {
			display.addPageEmbed((embed) => {
				if (moveData.maxMovePower) embed.addField('Base power as MAX move (Dynamax)', moveData.maxMovePower);
				if (moveData.zMovePower) embed.addField('Base power as Z-Move (Z-Crystal)', moveData.zMovePower);

				embed.addField('External Resources', externalSources);
				return embed;
			});
		}

		return display.addPageEmbed((embed) =>
			embed
				.addField('Z-Crystal', moveData.isZ ?? 'None', true)
				.addField('G-MAX Pokémon', moveData.isGMax ?? 'None', true)
				.addField('Available in Generation 8', moveData.isNonstandard === 'Past' ? 'No' : 'Yes', true)
				.addField('External Resources', externalSources)
		);
	}
}
