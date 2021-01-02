// gqlUtil file from Skyra (https://github.com/skyra-project/skyra) Copyright 2021 Antonio Román, used under the Apache-2.0 License
export namespace Mime {
	export const enum Types {
		ApplicationJson = 'application/json',
		ApplicationFormUrlEncoded = 'application/x-www-form-urlencoded',
		TextPlain = 'text/plain'
	}
}

/**
 * Fake GraphQL tag that just returns everything passed in as a single combined string
 * @remark used to trick the GraphQL parser into treating some code as GraphQL parseable data for syntax checking
 * @param gqlData data to pass off as GraphQL code
 */
export function gql(...args: any[]): string {
	return args[0].reduce((acc: string, str: string, idx: number) => {
		acc += str;
		if (Reflect.has(args, idx + 1)) acc += args[idx + 1];
		return acc;
	}, '');
}
