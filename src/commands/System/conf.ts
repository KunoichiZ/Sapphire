/* eslint-disable no-else-return */
/* eslint-disable no-case-declarations */
import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { ChannelMentionRegex } from '@sapphire/discord-utilities';
import { Message, MessageEmbed, Guild } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';
import { ConfigurableGuildKeys } from '#utils/constants';
import { BrandingColors } from '#utils/Branding';
import { cast } from '#utils/cast';
import { POOL } from '#root/config';

@ApplyOptions<CommandOptions>({
	fullCategory: ['System'],
	description: 'Change conf settings',
	preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class ConfCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const action = await args.pick('string').catch(() => null);

		if (!action) message.channel.send('Action not found. Run `conf help` for more information on actions.');
		const actions = ['set', 'show', 'help', 'keys'];

		if (actions.includes(action as string)) {
			switch (action) {
				case 'show':
					return this.show(message);
				case 'set':
					const key = cast<ConfigurableGuildKeys>(await args.pick('string').catch(() => null));

					if (!key) message.channel.send('Key not found. To view configurable keys run `conf keys`');
					if (!Object.values(ConfigurableGuildKeys).includes(key))
						message.channel.send('**Guild key non-configurable.** To view configurable keys run `conf keys`');

					const value = await args.pick('string').catch(() => null);

					if (!value) message.channel.send('Value not found.');

					return this.set(message, key, value as string);
				case 'help':
					return this.help(message);
				case 'keys':
					return this.keys(message);
				default:
					return this.show(message);
			}
		} else {
			return message.channel.send('Action not found. Run `conf help` for more information on actions.');
		}
	}

	private async show(message: Message) {
		const id = message.guild?.id as string;
		const selectQuery = `SELECT id, prefix, announcementchannel, modlogschannel, quotechannel FROM guilds WHERE id=${id}`;
		POOL.query(selectQuery, (err, res) => {
			if (err) {
				return console.log(err.stack);
			} else {
				const { prefix } = res.rows[0];
				let announcementChannel = res.rows[0].announcementchannel;
				let modlogsChannel = res.rows[0].modlogschannel;
				let quoteChannel = res.rows[0].quotechannel;

				if (announcementChannel === null || announcementChannel === '') {
					announcementChannel = 'Not set';
				}
				if (modlogsChannel === null || modlogsChannel === '') {
					modlogsChannel = 'Not set';
				}
				if (quoteChannel === null || quoteChannel === '') {
					quoteChannel = 'Not set';
				}

				return message.channel.send(
					new MessageEmbed()
						.setTitle('❯ Guild Configuration')
						.setColor(BrandingColors.Secondary)
						.setDescription(
							`Prefix → ${prefix}
                        Announcement Channel → ${announcementChannel}
                        ModLogs Channel → ${modlogsChannel}
                        Quote Channel → ${quoteChannel}`
						)
						.setTimestamp()
				);
			}
		});
	}

	private async set({ guild, channel }: Message, key: ConfigurableGuildKeys, value: string) {
		value = await this.resolveValue(guild!, key, value);
		const id = guild?.id as string;
		switch (key) {
			case 'prefix':
				const updatePrefixIntoQuery = `UPDATE guilds SET prefix = '${value}' WHERE id=${id}`;
				POOL.query(updatePrefixIntoQuery, (err) => {
					if (err) {
						return console.log(err.stack);
					} else {
						return channel.send(`Successfully set ${key} to \`${value}\`. To view current configurations run \`conf show\``);
					}
				});
				break;
			case 'announcementChannel':
				const updateAnnouncementIntoQuery = `UPDATE guilds SET announcementchannel = '${value}' WHERE id = ${id}`;
				POOL.query(updateAnnouncementIntoQuery, (err) => {
					if (err) {
						return console.log(err.stack);
					} else {
						return channel.send(`Successfully set ${key} to \`${value}\`. To view current configurations run \`conf show\``);
					}
				});
				break;
			case 'modlogsChannel':
				const updateModLogsIntoQuery = `UPDATE guilds SET modlogschannel = '${value}' WHERE id=${id}`;
				POOL.query(updateModLogsIntoQuery, (err) => {
					if (err) {
						return console.log(err.stack);
					} else {
						return channel.send(`Successfully set ${key} to \`${value}\`. To view current configurations run \`conf show\``);
					}
				});
				break;
			case 'quoteChannel':
				// const updateQuoteIntoQuery = `UPDATE guilds SET quotechannel = ${key.toString()} WHERE id=${id}`
				POOL.query(`UPDATE guilds SET quotechannel = '${value}' WHERE id = ${id}`, (err) => {
					if (err) {
						return console.log(err.stack);
					} else {
						return channel.send(`Successfully set ${key} to \`${value}\`. To view current configurations run \`conf show\``);
					}
				});
				break;
		}
	}

	private async keys({ channel }: Message) {
		return channel.send(
			new MessageEmbed()
				.setColor(BrandingColors.Secondary)
				.setTitle('❯ Configurable Keys')
				.setDescription(Object.entries(ConfigurableGuildKeys).map(([name, key]) => `**${name}** → \`${key}\``))
				.setTimestamp()
		);
	}

	private async help({ channel }: Message) {
		return channel.send(
			new MessageEmbed()
				.setColor(BrandingColors.Primary)
				.setTitle('Conf Action Help')
				.addField('❯ Show', "This action will display the current guild's configuration.")
				.addField('❯ Keys', 'This action will display all configurable keys which are used to manage guild configurations.')
				.addField('❯ Set', [
					'This action will set a key that is given to the given value.',
					'You must provide a configurable key. To view all the keys run command `conf keys`.',
					'You must also provide a configurable value for each key.',
					'- Channels, you can provide a mention, id or name'
				])
		);
	}

	private async resolveValue(guild: Guild, key: ConfigurableGuildKeys, value: string) {
		switch (key) {
			case ConfigurableGuildKeys.Prefix:
				if (value.length > 5) throw 'Prefix invalid. Prefixes cannot be longer than 5 characters.';
				value = value.toLowerCase().replace(/@here/, '');
				if (!value.length) throw 'Prefix invalid. Prefixes cannot be a mention.';

				return value;
			case ConfigurableGuildKeys.AnnouncementChannel:
			case ConfigurableGuildKeys.ModlogsChannel:
			case ConfigurableGuildKeys.QuoteChannel: {
				const id = ChannelMentionRegex.exec(value);
				const channel = id
					? guild.channels.cache.get(id![1])
					: guild.channels.cache.get(value) ??
					  guild.channels.cache.find((c) => c.name.toLowerCase() === value.toLowerCase() && c.type === 'text');

				if (!channel) throw 'Channel not found. Please make sure the channel exists.';

				return channel.name;
			}
			default:
				throw 'Value non-configurable.';
		}
	}
}
