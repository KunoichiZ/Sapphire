import { AfterInsert, AfterLoad, AfterRemove, AfterUpdate, Entity, Column, PrimaryColumn, BaseEntity } from 'typeorm';
import { kBigIntTransformer } from '#utils/util';

@Entity({ name: 'user_settings' })
export default class User extends BaseEntity {
	@PrimaryColumn('varchar', { name: 'id', length: 19 })
	public id!: string;

	@Column('bigint', { name: 'balance', default: 0, transformer: kBigIntTransformer })
	public balance = 0;

	@Column('bigint', { name: 'vault', default: 0, transformer: kBigIntTransformer })
	public vault = 0;

	private _balance: number | null;
	private _vault: number | null;

	public constructor() {
		super();
		this._balance = null;
		this._vault = null;
	}

	@AfterLoad()
	protected entityLoad() {
		this._balance = this.balance;
		this._vault = this.vault;
	}

	@AfterInsert()
	@AfterUpdate()
	protected entityUpdate() {
		if (this._balance !== null && this.balance !== this._balance) {
			this._balance = this.balance;
		}
		if (this._vault !== null && this.vault !== this._vault) {
			this._vault = this.vault;
		}
	}

	@AfterRemove()
	protected entityRemove() {
		this._balance = null;
		this._vault = null;
	}
}
