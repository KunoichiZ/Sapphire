import { PREFIX } from '#root/config';
import { Column, Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity('guild')
export class GuildEntity extends BaseEntity {
	@PrimaryColumn('varchar', { length: 19 })
	public id!: string;

	@Column('varchar', { length: 10, default: PREFIX })
	public prefix = PREFIX;
}
