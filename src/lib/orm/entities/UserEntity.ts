import { Entity, Column, PrimaryColumn, BaseEntity, OneToMany } from 'typeorm';
import WarnEntity from './WarnEntity';

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
}
