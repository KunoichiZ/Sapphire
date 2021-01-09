import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { GuildEntity } from './GuildEntity';
import UserEntity from './UserEntity';

@Entity('warns')
export default class WarnEntity extends BaseEntity {
	@PrimaryColumn('varchar')
	public id!: string;

	@Column('integer', { name: 'caseID' })
	public caseID!: number;

    @Column('varchar', { name: 'reason', length: 1000, nullable: true })
	public reason: string | null = null;

    @ManyToOne(() => GuildEntity, guild => guild.warns, { eager: true })
	public guild!: GuildEntity;

	@ManyToOne(() => UserEntity, member => member.warns, { eager: true })
	public member!: UserEntity;
}