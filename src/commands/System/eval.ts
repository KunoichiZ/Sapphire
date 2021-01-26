// Help command from Dominus (https://github.com/dominus-project/dominus) Copyright 2021 RealShadowNova, used under the Apache-2.0 License
import { ApplyOptions } from '@sapphire/decorators';
import type { Args, CommandOptions } from '@sapphire/framework';
import { Type } from '@sapphire/type';
import { codeBlock } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { inspect } from 'util';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['ev'],
	fullCategory: ['System'],
	description: 'Evaluates arbitary JavaScript',
	detailedDescription: 'Reserved only for owners',
	preconditions: ['OwnerOnly']
})
export default class extends SapphireCommand {
    public async run(message: Message, args: Args) {
        const code = await args.rest('string').catch(() => null);
        if (!code) throw 'Code not found. You must provide some code to evaluate.';
        const language = args.getOption('language') ?? args.getOption('lang') ?? args.getFlags('json') ? 'json' : 'js';
        const { success, type, time, result } = await this.eval(message, args, code);

        if (!success) return message.channel.send(`**Ouput**:${codeBlock('', result)}\n**Type**:${codeBlock('ts', type.toString())}\n${time}`);

        const footer = codeBlock('ts', type.toString());

        return message.channel.send(`**Output**:\n${codeBlock(language, result)}\n**Type**:${footer}\n${time}`);
    }

    private async eval(message: Message, args: Args, code: string) {
		let time = Date.now();
		let success: boolean | undefined = undefined;
		let syncTime: string | undefined = undefined;
		let asyncTime: string | undefined = undefined;
		let result: unknown | undefined = undefined;
		let type: Type | undefined = undefined;
		try {
			if (args.getFlags('async')) code = `(async () => {\n${code}\n})();`;

			// @ts-expect-error 6133
			const msg = message;

			// eslint-disable-next-line no-eval
			result = eval(code);
			syncTime = (Date.now() - time).toString();
			if (args.getFlags('async')) {
				time = Date.now();
				result = await result;
				asyncTime = (Date.now() - time).toString();
			}
			type = new Type(result);
			success = true;
		} catch (error) {
			if (!syncTime) syncTime = (Date.now() - time).toString();
			if (args.getFlags('async') && !asyncTime) asyncTime = (Date.now() - time).toString();
			if (!type!) type = new Type(error);
			result = error;
			success = false;
		}

		if (typeof result !== 'string') {
			result =
				result instanceof Error
					? result.stack
					: args.getFlags('json')
					? JSON.stringify(result, null, 2)
					: inspect(result, {
							depth: args.getOption('depth') ? parseInt(args.getOption('depth') ?? '', 10) || 0 : 0,
							showHidden: args.getFlags('showHidden')
					  });
		}
		return { success, type, time: this.formatTime(syncTime, asyncTime ?? ''), result };
	}

	private formatTime(syncTime: string, asyncTime: string) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>ms` : `⏱ ${syncTime}ms`;
	}
}