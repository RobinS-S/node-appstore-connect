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

import got from "got";
import { TokenProvider } from "../client/token-provider";

export class InAppProductClient {
    constructor(private readonly tokenProvider: TokenProvider) {
    }
    public async getInAppProducts(opts: GetInAppProductsOptions): Promise<GetInAppProductsResult> {

        const TOKEN = this.tokenProvider.getBearerToken();
        const RESPONSE = await got.get(`https://api.appstoreconnect.apple.com/v1/apps/${opts.AppId}/inAppPurchases`, {
            'headers': {
                'Authorization': 'Bearer ' + TOKEN,
                'Accept': 'application/json'
            },
            'responseType': 'buffer',
            'searchParams': {
            },
            'throwHttpErrors': false,
        });

        if (200 !== RESPONSE.statusCode) {
            if (404 === RESPONSE.statusCode) {
                return null;
            }

            throw new Error(`Unexpected Response: [${RESPONSE.statusCode
                }] '${RESPONSE.body}'`);
        }
        return JSON.parse(RESPONSE.body.toString('utf8')) as GetInAppProductsResult;
    }
}
/**
* Options for 'Client.getInAppProducts()' method.
*/
export interface GetInAppProductsOptions {
    'AppId': string;
}

/**
* Result of a 'Client.getInAppProducts()' method call.
*/
export interface GetInAppProductsResult {
    /**
     * The list of products.
     */
    'data': { [index: number]: GetInAppProductsItem };
    'meta': { 'paging': { 'total': number, 'limit': number } };
    'links': { 'self': string };
}

/**
* An app item of 'GetInAppProductsResult.products'.
*/
export interface GetInAppProductsItem {
    'type': string;
    'id': string;
    'attributes': {
        'referenceName': string,
        'productId': string,
        'inAppPurchaseType': string,
        'state': string
    },
    'links': {
        'self': string;
    }
}