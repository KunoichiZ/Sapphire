// Command file from godfather (https://github.com/Soumil07/godfather) Copyright 2020 Soumil07, used under the AGPL-3.0 License
import { Command } from '@sapphire/framework';
import { sep } from 'path';

export default abstract class SapphireCommand extends Command {
	public get category() {
		return this.path.split(sep).reverse()[1] ?? 'General';
	}
}
