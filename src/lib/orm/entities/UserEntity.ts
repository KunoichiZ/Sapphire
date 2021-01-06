import { Entity, Column, PrimaryColumn, BaseEntity } from 'typeorm';

@Entity('users')
export default class UserEntity extends BaseEntity {
	@PrimaryColumn('varchar')
	public id!: string;

	@Column('varchar', { default: '' })
	public switchFC!: string;

    @Column('varchar', { default: '' })
	public goFC!: string;
}
