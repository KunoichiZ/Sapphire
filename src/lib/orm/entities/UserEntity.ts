import { Entity, Column, PrimaryColumn, BaseEntity, OneToMany, ManyToOne } from 'typeorm';
import WarnEntity from './WarnEntity';
import { GuildEntity } from './GuildEntity';

@Entity('users')
export default class UserEntity extends BaseEntity {
	@PrimaryColumn('varchar')
	public id!: string;

	@Column('varchar', { default: '' })
	public switchFC!: string;

    @Column('varchar', { default: '' })
	public goFC!: string;

	@OneToMany(() => WarnEntity, warn => warn.member)
	public warns!: WarnEntity[];

	@ManyToOne(() => GuildEntity, guild => guild.members, { eager: true })
	public guild!: GuildEntity;
}
