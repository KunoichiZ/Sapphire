import { Entity, Column, PrimaryColumn, BaseEntity } from 'typeorm';
import { PREFIX } from '#root/config';

@Entity('guilds')
export default class GuildEntity extends BaseEntity {
	@PrimaryColumn('varchar')
	public id!: string;

	@Column({ default: PREFIX })
	public prefix!: string;
}
