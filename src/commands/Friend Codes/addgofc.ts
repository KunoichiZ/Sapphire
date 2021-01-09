import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { getUser } from '#utils/get';

@ApplyOptions<CommandOptions>({
    category: 'Friend Codes',
	description: 'Sets your Pokémon GO FC'
})
export default class AddGOFCCommand extends SapphireCommand {
    public async run(message: Message, args: Args) {
        const goFC = await args.restResult('string');
        const userSettings = await getUser(message.author.id as string);
        if (!goFC.success) {
			return message.channel.send(`You did not add a Pokémon GO FC!`);
		} else if(userSettings.goFC) {
            return message.channel.send(`You've already added a Pokémon GO FC!`);
        } else {
            userSettings.goFC = goFC.value;
            await userSettings.save();
            return message.channel.send(`Your Pokémon GO been set to: ${userSettings.goFC}`);
        }
    }
}