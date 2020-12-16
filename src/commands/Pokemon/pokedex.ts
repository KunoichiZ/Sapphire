// import { AbilitiesEntry, DexDetails, GenderEntry, StatsEntry } from '@favware/graphql-pokemon';
// import { MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { Query } from '@favware/graphql-pokemon';
import nodeFetch from 'node-fetch';
import SapphireCommand from '@lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
    aliases: ['dex', 'pokemon', 'mon', 'poke', 'dexter'],
    description: 'Gets data for any given Pokémon'
})
export default class PokedexCommand extends SapphireCommand {
    public async run(message: Message, args: Args) {
        
        const pokemon = await args.rest('string');
        // message.channel.send(pokemon);
        console.log(pokemon)


        interface GraphQLPokemonResponse<K extends keyof Omit<Query, '__typename'>> {
            data: Record<K, Omit<Query[K], '__typename'>>;
        }
        
        nodeFetch('https://graphqlpokemon.favware.tech/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            query: `
                {
                    getPokemonDetails(pokemon: ${pokemon} skip: 0 take: 2 reverse: true) {
                        num
                        species
                        types
                        abilities { first second hidden }
                        baseStats { hp attack defense specialattack specialdefense speed }
                        gender { male female }
                        height
                        weight
                        flavorTexts { game flavor }
                        sprite
                        shinySprite
                        smogonTier
                        smogonPage
                        serebiiPage
                        bulbapediaPage
                    }
                }
            `
            })
        })
        .then((res) => res.json() as Promise<GraphQLPokemonResponse<'getPokemonDetails'>>)
        .then((json) => console.log(json.data));

    }
}


