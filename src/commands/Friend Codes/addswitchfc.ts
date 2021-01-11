/* eslint-disable no-else-return */
import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { getUser } from '#utils/get';

@ApplyOptions<CommandOptions>({
	category: 'Friend Codes',
	description: 'Sets your Nintendo Switch FC'
})
export default class AddSwitchFCCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const switchFC = await args.restResult('string');
		const userSettings = await getUser(message.author.id as string);
		if (!switchFC.success) {
			return message.channel.send(`You did not add a Nintendo Switch FC!`);
		} else if (userSettings.switchFC) {
			return message.channel.send(`You've already added a Nintendo Switch FC!`);
		} else {
			userSettings.switchFC = switchFC.value;
			await userSettings.save();
			return message.channel.send(`Your Nintendo Switch FC been set to: ${userSettings.switchFC}`);
		}
	}
}
