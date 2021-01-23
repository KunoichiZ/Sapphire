import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import type { Message, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { POOL } from '#root/config';

@ApplyOptions<CommandOptions>({
	aliases: ['purge', 'nuke', 'sweep'],
	fullCategory: ['Moderation'],
	description: 'Prunes a certain amount of messages',
	preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class PurgeCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const amount = await args.pick('number').catch(() => null);

		if (!amount) throw 'Amount not found.';

		await (message.channel as TextChannel).bulkDelete(amount > 100 ? 100 : amount);

		const guildID = message.guild?.id;
		const selectQuery = `SELECT modlogschannel FROM guilds WHERE id=${guildID}`;
		POOL.query(selectQuery, (err, res) => {
			if (err) {
				console.log(err.stack);
			}
			const { modlogschannel } = res.rows[0];
			const modlogsChannel = message.guild?.channels.cache.find((channel) => channel.name === modlogschannel) as TextChannel;
			modlogsChannel.send(`Purged ${amount > 100 ? 100 : amount} messages.`);
			return message.channel.send(`Purged ${amount > 100 ? 100 : amount} messages.`);
		});
	}
}
