import { Entity, Column, PrimaryColumn, BaseEntity, OneToMany } from 'typeorm';
import { PREFIX } from '#root/config';
import WarnEntity from './WarnEntity';

export const DefaultConfigurableGuildValues = {
	prefix: () => PREFIX,
	quoteChannel: 'quotes',
	announcementChannel: 'discord-announcements',
	modlogsChannel: 'mod-logs'
};

@Entity('guilds')
export class GuildEntity extends BaseEntity {
	@PrimaryColumn('varchar')
	public id!: string;

	@Column('varchar', { default: PREFIX })
	public prefix!: string;

	@OneToMany(() => WarnEntity, infraction => infraction.guild)
	public warns!: WarnEntity[];

	@Column('varchar')
	public quoteChannel!: string;

	@Column('varchar')
	public announcementChannel!: string;

	@Column('varchar')
	public modlogsChannel!: string;
}

export enum ConfigurableGuildKeys {
	Prefix = 'prefix',
	QuoteChannel = 'quoteChannel',
	ModlogsChannel = 'modlogsChannel',
	AnnouncementChannel = 'announcementChannel'
}
