// Command file from godfather (https://github.com/Soumil07/godfather) Copyright 2020 Soumil07, used under the AGPL-3.0 License
import { Command, CommandOptions, PieceContext } from '@sapphire/framework';
import { sep } from 'path';

export default abstract class SapphireCommand extends Command {
	public fullCategory: string[];

	public constructor(context: PieceContext, { name, ...options }: CommandOptions) {
		super(context, { name, ...options });

		const paths = context.path.split(sep);

		this.fullCategory = paths.slice(paths.indexOf('commands') + 1, -1);
	}

	public get category() {
		return this.fullCategory[0] ?? 'General';
	}

	/**
	 * The sub category for the command
	 * @since 0.0.1
	 * @type {string}
	 * @readonly
	 */
	public get subCategory() {
		return this.fullCategory[1] ?? 'General';
	}
}
