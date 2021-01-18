// Eval command from Gitcord (https://github.com/gitcord-project) Copyright 2020 Charalampos Fanoulis, used under the MIT license
import { Stopwatch } from '@sapphire/stopwatch';
import { Type } from '@sapphire/type';
import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { codeBlock, isThenable } from '@sapphire/utilities';
import { Message, MessageEmbed } from 'discord.js';
import { inspect } from 'util';
import SapphireCommand from '#lib/SapphireCommand';
import { clean } from '#utils/clean';
import { fetch, FetchMethods, FetchResultTypes } from '#utils/Pokemon';

@ApplyOptions<CommandOptions>({
	aliases: ['ev'],
	category: 'System',
	description: 'Evaluates arbitary JavaScript',
	detailedDescription: 'Reserved only for owners',
	preconditions: ['OwnerOnly']
})
export default class EvalCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const code = await args.pick('string');
		const { success, result, time, type } = await this.eval(code);

		return result.length > 2000
			? this.resultToHastebin(message, success, time, result, type)
			: message.channel.send(
					new MessageEmbed()
						.setColor(success ? 0x00ff00 : 0xff0000)
						.setTitle(success ? `Success!` : `Something went... horribly wrong`)
						.addField('Result:', codeBlock('js', result.padEnd(20, ' ')))
						.addField('Type:', codeBlock('ts', type))
						.setFooter(time, 'https://github.com/twitter/twemoji/blob/master/assets/72x72/23f1.png?raw=true')
			  );
	}

	// Eval the input
	private async eval(code: string) {
		const stopwatch = new Stopwatch();
		let success: boolean | undefined = undefined;
		let syncTime: string | undefined = undefined;
		let asyncTime: string | undefined = undefined;
		let result: unknown | undefined = undefined;
		let thenable = false;
		let type: Type | undefined = undefined;
		try {
			// eslint-disable-next-line no-eval
			result = eval(code);
			syncTime = stopwatch.toString();
			type = new Type(result);
			if (isThenable(result)) {
				thenable = true;
				stopwatch.restart();
				result = await result;
				asyncTime = stopwatch.toString();
			}
			success = true;
		} catch (error) {
			if (!syncTime) syncTime = stopwatch.toString();
			if (thenable && !asyncTime) asyncTime = stopwatch.toString();
			if (!type!) type = new Type(error);
			result = error;
			success = false;
		}

		stopwatch.stop();
		if (typeof result !== 'string') {
			result = result instanceof Error ? result.stack : inspect(result, { depth: 0 });
		}
		return { success, type: type!, time: this.formatTime(syncTime, asyncTime ?? ''), result: clean(result as string) };
	}

	private formatTime(syncTime: string, asyncTime?: string) {
		return asyncTime ? `${asyncTime}<${syncTime}>` : `${syncTime}`;
	}

	private async resultToHastebin(message: Message, success: boolean, time: string, result: string, type: Type) {
		const { key } = (await fetch('https://hasteb.in/documents', { method: FetchMethods.Post, body: result }, FetchResultTypes.JSON)) as {
			key: string;
		};
		return message.channel.send(
			new MessageEmbed()
				.setColor(success ? 0x00ff00 : 0xff0000)
				.setTitle(success ? `Success!` : `Something went... horribly wrong`)
				.setDescription(
					success
						? `The result was too big for Discord, so I posted it on Hastebin: https://hasteb.in/${key}.js`
						: `Well that didn't run greatly. I couldn't even fit the result here. I've thrown it on Hastebin: https://hasteb.in/${key}.js`
				)
				.addField('Type:', codeBlock('ts', type))
				.setFooter(`Took ${time}`, 'https://github.com/twitter/twemoji/blob/master/assets/72x72/23f1.png?raw=true')
		);
	}
}
