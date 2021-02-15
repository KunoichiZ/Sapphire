// Piece argument is from godfather (https://github.com/Stitch07/godfather) Copyright 2020 Stitch07, used under the AGPL-3.0 License
import { Argument, ArgumentResult, Piece } from '@sapphire/framework';

export default class extends Argument<Piece> {
	public run(parameter: string): ArgumentResult<Piece> {
		for (const store of this.context.client.stores.values()) {
			if (store.has(parameter)) return this.ok(store.get(parameter)!);
		}

		return this.error({ parameter, identifier: 'ArgumentPieceInvalidPiece', message: 'Invalid piece' });
	}
}
