// Piece argument is from godfather (https://github.com/Soumil07/godfather) Copyright 2020 Soumil07, used under the AGPL-3.0 License
import { Argument, ArgumentResult, Piece } from '@sapphire/framework';

export default class extends Argument<Piece> {

	public run(argument: string): ArgumentResult<Piece> {
		for (const store of this.context.client.stores.values()) {
			if (store.has(argument)) return this.ok(store.get(argument)!);
		}

		return this.error(argument, 'ArgumentPieceInvalidPiece', 'Invalid piece');
	}

}