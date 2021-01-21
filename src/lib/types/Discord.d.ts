import type { Guild, GuildMember, Message, NewsChannel, TextChannel } from 'discord.js';

export interface GuildMessage extends Message {
	channel: TextChannel | NewsChannel;
	readonly guild: Guild;
	readonly member: GuildMember;
}
