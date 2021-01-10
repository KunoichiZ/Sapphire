import { Entity, Column, PrimaryColumn, BaseEntity, OneToMany } from 'typeorm';
import { PREFIX } from '#root/config';
import WarnEntity from './WarnEntity';
import UserEntity from './UserEntity';

export const DefaultConfigurableGuildValues = {
	prefix: () => PREFIX,
	quotechannel: 'quotes',
	announcementchannel: 'discord-announcements',
	modlogschannel: 'mod-logs'
};

@Entity('guilds')
export class GuildEntity extends BaseEntity {
	@PrimaryColumn('varchar')
	public id!: string;

	@Column('integer', { default: 0 })
	public totalwarns!: number;

	@Column('varchar', { default: PREFIX })
	public prefix!: string;

	@OneToMany(() => WarnEntity, warn => warn.guild)
	public warns!: WarnEntity[];

	@Column('varchar')
	public quotechannel!: string;

	@Column('varchar')
	public announcementchannel!: string;

	@Column('varchar')
	public modlogschannel!: string;

	@OneToMany(() => UserEntity, user => user.guild)
	public members!: UserEntity[];

	public async increaseTotalCases() {
		this.totalwarns += 1;
		await this.save();
		return this.totalwarns;
	}
}

export enum ConfigurableGuildKeys {
	Prefix = 'prefix',
	QuoteChannel = 'quotechannel',
	ModlogsChannel = 'modlogschannel',
	AnnouncementChannel = 'announcementchannel'
}
