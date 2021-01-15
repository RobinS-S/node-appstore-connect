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
import { TokenProvider } from "../client/token-provider";
import { TestflightClientInterface } from "./testflight-client.interface";
import { TestflightAddBuildToExternalGroupOptions } from "./testflight-add-build-to-external-group-options";
import { PlatformType } from "../client";
import { BuildClient } from "../build/build-client";
import { TestflightNotifyBetaTestersOptions } from "./testflight-notify-beta-testers-options";
import { TestflightCreateGroupOptions } from "./testflight-create-group-options";
export declare class TestflightClient implements TestflightClientInterface {
    private readonly tokenProvider;
    private readonly buildClient;
    /**
     * @param {TokenProvider} tokenProvider
     * @param {BuildClient} buildClient
     */
    constructor(tokenProvider: TokenProvider, buildClient: BuildClient);
    /**
     * Adds build to external test flight user group. App must be already approved for beta testing perform this function.
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {number} buildNumber
     * @param {string} groupId
     * @param {TestflightAddBuildToExternalGroupOptions?} options
     */
    addBuildToExternalGroupByGroupId(appId: number, version: string, platform: PlatformType, buildNumber: number | string, groupId: string, options?: TestflightAddBuildToExternalGroupOptions): Promise<void>;
    /**
     * Adds build to group by group name
     *
     * @param {number} appId
     * @param {string} buildId
     * @param {string} groupName
     * @param {TestflightAddBuildToExternalGroupOptions?} options
     */
    addBuildToExternalGroupByBuildId(appId: number, buildId: string, groupName: string, options?: TestflightAddBuildToExternalGroupOptions): Promise<void>;
    /**
     * Adds build to external test flight user group. App must be already approved for beta testing perform this function.
     *
     * @param {string} buildId
     * @param {string} groupId
     * @param {TestflightAddBuildToExternalGroupOptions?} options
     */
    addBuildToExternalGroupByGroupIdAndBuildId(buildId: string, groupId: string, options?: TestflightAddBuildToExternalGroupOptions): Promise<void>;
    /**
     * Notifies beta testers there is a new build
     *
     * @param {string} buildId
     * @param {TestflightNotifyBetaTestersOptions?} options
     *
     */
    notifyBetaTestersOfNewBuildByBuildId(buildId: string, options?: TestflightNotifyBetaTestersOptions): Promise<void>;
    /**
     * Creates an external group
     *
     * @param {number} appId
     * @param {string} groupName
     * @param {TestflightCreateGroupOptions?} options
     *
     * @returns Promise<string> A promise with the group id
     */
    createExternalBetaTestersGroup(appId: number, groupName: string, options?: TestflightCreateGroupOptions): Promise<string>;
    /**
     * Gets an external beta testing group ID by app ID and group name
     *
     * @param {number} appId
     * @param {string} groupName
     *
     * @throws {ApiError | Error}
     * @returns Promise<string> A promise with the group id
     */
    getExternalBetaTestersGroupId(appId: number, groupName: string): Promise<string>;
}
