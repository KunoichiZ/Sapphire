import { AfterInsert, AfterLoad, AfterRemove, AfterUpdate, Entity, Column, PrimaryColumn, BaseEntity } from 'typeorm';
import { kBigIntTransformer } from '#utils/util';

@Entity({ name: 'user_settings' })
export default class User extends BaseEntity {
	@PrimaryColumn('varchar', { name: 'id', length: 19 })
	public id!: string;

	@Column('varchar', { name: 'switchfc', default: '', length: 17})
	public switchfc = '';

	@Column('varchar', { name: 'gofc', default: '', length: 14})
	public gofc = '';

	@Column('bigint', { name: 'balance', default: 0, transformer: kBigIntTransformer })
	public balance = 0;

	@Column('bigint', { name: 'vault', default: 0, transformer: kBigIntTransformer })
	public vault = 0;

	private _balance: number | null;
	private _vault: number | null;
	private _switchfc: string | null;
	private _gofc: string | null;

	public constructor() {
		super();
		this._balance = null;
		this._vault = null;
		this._switchfc = null;
		this._gofc = null;
	}

	@AfterLoad()
	protected entityLoad() {
		this._balance = this.balance;
		this._vault = this.vault;
		this._switchfc = this.switchfc;
		this._gofc = this.gofc;
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
		if (this._switchfc !== null && this.switchfc !== this._switchfc) {
			this._switchfc = this.switchfc;
		}
		if (this._gofc !== null && this.gofc !== this._gofc) {
			this._gofc = this.gofc;
		}
	}

	@AfterRemove()
	protected entityRemove() {
		this._balance = null;
		this._vault = null;
		this._switchfc = null;
		this._gofc = null;
	}
}
