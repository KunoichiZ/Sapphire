import { Entity, Column, PrimaryColumn, BaseEntity, OneToMany } from 'typeorm';
import { PREFIX } from '#root/config';
import WarnEntity from './WarnEntity';
import UserEntity from './UserEntity';

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

	@Column('integer', { default: 0 })
	public totalWarns!: number;

	@Column('varchar', { default: PREFIX })
	public prefix!: string;

	@OneToMany(() => WarnEntity, warn => warn.guild)
	public warns!: WarnEntity[];

	@Column('varchar')
	public quoteChannel!: string;

	@Column('varchar')
	public announcementChannel!: string;

	@Column('varchar')
	public modlogsChannel!: string;

	@OneToMany(() => UserEntity, user => user.guild)
	public members!: UserEntity[];

	public async increaseTotalCases() {
		this.totalWarns += 1;
		await this.save();
		return this.totalWarns;
	}
}

export enum ConfigurableGuildKeys {
	Prefix = 'prefix',
	QuoteChannel = 'quoteChannel',
	ModlogsChannel = 'modlogsChannel',
	AnnouncementChannel = 'announcementChannel'
}
