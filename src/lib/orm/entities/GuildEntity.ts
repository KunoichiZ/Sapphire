import { Entity, Column, PrimaryColumn, BaseEntity, OneToMany } from 'typeorm';
import { PREFIX } from '#root/config';
import WarnEntity from './WarnEntity';

@Entity('guilds')
export default class GuildEntity extends BaseEntity {
	@PrimaryColumn('varchar')
	public id!: string;

	@Column('varchar', { default: PREFIX })
	public prefix!: string;

	@OneToMany(() => WarnEntity, infraction => infraction.guild)
	public warns!: WarnEntity[];
}
