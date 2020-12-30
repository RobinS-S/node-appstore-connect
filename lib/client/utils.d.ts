/**
 * This file is part of the node-appstore-connect distribution.
 * Copyright (c) e.GO Digital GmbH, Aachen, Germany (https://www.e-go-digital.com/)
 *
 * node-appstore-connect is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * node-appstore-connect is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
/// <reference types="node" />
import * as zlib from 'zlib';
/**
 * A CSV row.
 */
export declare type CSVRow = {
    [name: string]: string;
};
/**
 * Unzips data.
 *
 * @param {zlib.InputType} input The data to unzip.
 * @param {string} [encoding] If defined, will result will be returned as string, with the given encoding.
 *
 * @return {Promise<Buffer|string>} The promise with the unzipped data.
 */
export declare function gunzip(input: zlib.InputType): Promise<Buffer>;
export declare function gunzip(input: zlib.InputType, encoding: string): Promise<string>;
/**
 * Checks if a value is (null) or (undefined).
 *
 * @param {unknown} val The value to check.
 *
 * @return {boolean} Is (null) or (undefined).
 */
export declare function isNil(val: unknown): boolean;
/**
 * Parses data as CSV.
 *
 * @param {any} data The data to parse.
 *
 * @return {Promise<TRow[]>} The promise with the rows.
 */
export declare function readCSV<TRow extends any = CSVRow>(data: any): Promise<TRow[]>;
