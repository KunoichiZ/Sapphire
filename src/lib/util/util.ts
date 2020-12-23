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

import { FetchError } from '@lib/errors/FetchError';
import { Events } from '@sapphire/framework';
import { isThenable, mergeObjects } from '@sapphire/utilities';
import { Client } from 'discord.js';
import nodeFetch, { RequestInit, Response } from 'node-fetch';
import { ValueTransformer } from "typeorm";

export function getAllRegexMatches(regex: RegExp, string: string) {
	let match = undefined;
	let matches: string[] = [];

	while ((match = regex.exec(string)) !== null) {
		matches.push(match[1]);
	}

	return matches;
}

export function wrapAroundNumber(num: number, floor: number, ceiling: number) {
	if (num < floor) return ceiling;
	if (num > ceiling) return floor;
	return num;
}

export function removeFirstAndAdd<T>(array: Array<T>, value: T): Array<T> {
	let i = 0;
	while (i < array.length) {
		array[i] = array[++i];
	}

	array[i - 1] = value;
	return array;
}

export function floatPromise(ctx: { client: Client }, promise: Promise<unknown>) {
	if (isThenable(promise)) promise.catch((error) => ctx.client.emit(Events.Error, error));
}

export const enum FetchResultTypes {
	JSON,
	Buffer,
	Text,
	Result
}

export const enum FetchMethods {
	Post = 'POST',
	Get = 'GET',
	Put = 'PUT',
	Delete = 'DELETE'
}

export const kBigIntTransformer: ValueTransformer = { from: Number, to: String };

export async function fetch<R>(url: string, type?: FetchResultTypes.JSON): Promise<R>;
export async function fetch<R>(url: string, options: RequestInit, type?: FetchResultTypes.JSON): Promise<R>;
export async function fetch(url: string, type: FetchResultTypes.Buffer): Promise<Buffer>;
export async function fetch(url: string, options: RequestInit, type: FetchResultTypes.Buffer): Promise<Buffer>;
export async function fetch(url: string, type: FetchResultTypes.Text): Promise<string>;
export async function fetch(url: string, options: RequestInit, type: FetchResultTypes.Text): Promise<string>;
export async function fetch(url: string, type: FetchResultTypes.Result): Promise<Response>;
export async function fetch(url: string, options: RequestInit, type: FetchResultTypes.Result): Promise<Response>;
export async function fetch<R>(url: string, options: RequestInit, type: FetchResultTypes): Promise<Response | Buffer | string | R>;
export async function fetch(url: string, options?: RequestInit | FetchResultTypes, type?: FetchResultTypes) {
	if (typeof options === 'undefined') {
		options = {};
		type = FetchResultTypes.JSON;
	} else if (typeof options === 'number') {
		type = options;
		options = {};
	} else if (typeof type === 'undefined') {
		type = FetchResultTypes.JSON;
	}
	const fetchOptions = mergeObjects(
		{
			headers: {
				'User-Agent': 'GitcordBot/v0.0.1 by @cfanoulis'
			}
		},
		options
	);

	const result: Response = await nodeFetch(url, fetchOptions);
	if (!result.ok) throw new FetchError(url, result.status, await result.text());

	switch (type) {
		case FetchResultTypes.Result:
			return result;
		case FetchResultTypes.Buffer:
			return result.buffer();
		case FetchResultTypes.JSON:
			return result.json();
		case FetchResultTypes.Text:
			return result.text();
		default:
			throw new Error(`Unknown type ${type}`);
	}
}