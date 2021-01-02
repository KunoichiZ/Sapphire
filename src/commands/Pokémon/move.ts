import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { fetchGraphQLPokemon, getMoveDetailsByFuzzy, parseBulbapediaURL } from '#utils/Pokemon';
import { toTitleCase } from '@sapphire/utilities';
import { BrandingColors } from '#utils/Branding';
import type { MoveEntry } from '@favware/graphql-pokemon';

@ApplyOptions<CommandOptions>({
	category: 'Pokémon',
	description: 'Gets data for any given Pokémon move'
})
export default class MoveCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const move = await args.rest('string');
		const moveDetails = await this.fetchAPI(move.toLowerCase());

		return message.channel.send(await this.buildDisplay(moveDetails));
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
		const externalResourceData = [
			`[Bulbapedia](${parseBulbapediaURL(moveData.bulbapediaPage)} )`,
			`[Serebii](${moveData.serebiiPage})`,
			`[Smogon](${moveData.smogonPage})`
		].join(' | ');

		const display = new MessageEmbed()
			.setColor(await BrandingColors.Primary)
			.setAuthor(`Move - ${toTitleCase(moveData.name)}`, 'https://cdn.kunoichiz.me/cdn/images/dex.png')
			.setDescription(moveData.desc || moveData.shortDesc)
			.addField('Type', moveData.type, true)
			.addField('Base Power', moveData.basePower, true)
			.addField('PP', moveData.pp, true)
			.addField('Accuracy', `${moveData.accuracy}%`, true)
			.addField('Category', moveData.category, true)
			.addField('Priority', moveData.priority, true)
			.addField('Target', moveData.target, true)
			.addField('Contest Condition', moveData.contestType ?? 'None', true);

		if (moveData.isFieldMove) {
			display.addField('Effect outside of battle', moveData.isFieldMove, false);
		}
		if (moveData.maxMovePower) display.addField('Base power as MAX move (Dynamax)', moveData.maxMovePower);
		if (moveData.zMovePower) display.addField('Base power as Z-Move (Z-Crystal)', moveData.zMovePower);

		display
			.addField('Z-Crystal', moveData.isZ ?? 'None', true)
			.addField('G-MAX Pokémon', moveData.isGMax ?? 'None', true)
			.addField('Available in Generation 8', moveData.isNonstandard === 'Past' ? 'No' : 'Yes', true)
			.addField('External Resources', externalResourceData);

		return display;
	}
}
