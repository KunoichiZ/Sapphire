/*
Copyright © 2020 Charalampos Fanoulis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice (including the next paragraph) shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { EventIterator, EventIteratorOptions } from '@sapphire/event-iterator';
import { mergeDefault, mergeObjects } from '@sapphire/utilities';
import { wrapAroundNumber } from '#utils/util';
import type { Message, MessageEmbed, MessageReaction, ReactionEmoji } from 'discord.js';

export interface ReactionDisplayOptions extends Partial<EventIteratorOptions<[MessageReaction]>> {
	noPageNumber?: boolean;
	emojis: {
		previousPage: string;
		nextPage: string;
		stopDisplay: string;
	};
}

export class PagedDisplay {
	private iterator: EventIterator<[MessageReaction]> | undefined;
	private pages: (string | MessageEmbed)[];
	private index = 0;
	private options: ReactionDisplayOptions;
	private message: Message;

	public constructor(message: Message, items: (string | MessageEmbed)[], options?: ReactionDisplayOptions) {
		this.message = message;
		this.options = mergeDefault(
			{
				idle: 50000,
				limit: 15,
				emojis: {
					previousPage: '◀️',
					nextPage: '▶️',
					stopDisplay: '⏹️'
				}
			},
			options
		);
		this.pages = items.map(this.addPageFooter.bind(this));
	}

	public async run(message: Message) {
		const pageMsg = await message.channel.send(this.pages[0]);
		for (const emoji of Object.values(this.options.emojis)) {
			await pageMsg.react(emoji);
		}

		this.iterator = new EventIterator<[MessageReaction]>(
			message.client,
			'messageReactionAdd',
			mergeObjects(this.options, { filter: this.iteratorFilter.bind(this, pageMsg) })
		);
		for await (const [reaction] of this.iterator) {
			await reaction.users.remove(this.message.author.id);
			switch (reaction.emoji.name) {
				case this.options.emojis.nextPage:
					await this.nextPage(pageMsg);
					break;
				case this.options.emojis.previousPage:
					await this.previousPage(pageMsg);
					break;
				case this.options.emojis.stopDisplay:
					await this.stopDisplay(pageMsg);
					break;
			}
		}

		await pageMsg.reactions.removeAll();
	}

	private addPageFooter(page: string | MessageEmbed, pageIndex: number, pages: unknown[]) {
		if (this.options.noPageNumber || typeof page === 'string') return page;
		page.setFooter(`Page ${pageIndex + 1}/${pages.length}`);
		return page;
	}

	private iteratorFilter(page: Message, [value]: [MessageReaction]) {
		return (
			value.message.id === page.id &&
			value.users.cache.has(this.message.author.id) &&
			Object.values(this.options.emojis).includes((value.emoji as ReactionEmoji).name)
		);
	}

	private async nextPage(pageMsg: Message) {
		this.index = wrapAroundNumber(this.index + 1, 0, this.pages.length - 1);
		await pageMsg.edit(this.pages[this.index]);
	}

	private async previousPage(pageMsg: Message) {
		this.index = wrapAroundNumber(this.index - 1, 0, this.pages.length - 1);
		await pageMsg.edit(this.pages[this.index]);
	}

	private async stopDisplay(pageMsg: Message) {
		await pageMsg.reactions.removeAll();
		this.iterator!.end();
	}
}

// Definition of wrapAroundNumber
// export function wrapAroundNumber(num: number, floor: number, ceiling: number) {
// 	if (num < floor) return ceiling;
// 	if (num > ceiling) return floor;
// 	return num;
// }
