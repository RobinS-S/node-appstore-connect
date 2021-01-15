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
import { BuildStatus } from "./build-status";
import { BuildClientInterface } from "./build-client.interface";
import { WaitForBuildProcessingOptions } from "./wait-for-build-processing-options";
import { PlatformType } from "../client";
import { BuildUpdateOptions } from "./build-update-options";
import { BuildInterface } from "./build.interface";
export declare class BuildClient implements BuildClientInterface {
    private readonly tokenProvider;
    /**
     * @param {TokenProvider} tokenProvider
     */
    constructor(tokenProvider: TokenProvider);
    /**
     * Gets the build Id for a build
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {string} buildNumber
     */
    getBuildId(appId: number, version: string, platform: PlatformType, buildNumber?: number | string): Promise<string>;
    /**
     * Gets status for a build
     *
     * @param {string} buildId
     *
     * @return {Promise<BuildStatus>}
     */
    getBuildStatusFromBuildId(buildId: string): Promise<BuildStatus>;
    /**
     * Get's the build status for a build
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {string} buildNumber
     */
    getBuildStatus(appId: number, version: string, platform: PlatformType, buildNumber?: number | string): Promise<BuildStatus>;
    /**
     * Waits for build processing to complete. Throws error if build is invalid. Waits indefinitely if build does not exist.
     *
     * @param {number} appId
     * @param {PlatformType} platform
     * @param {string} version
     * @param {number} buildNumber
     * @param {WaitForBuildProcessingOptions} options
     * @throws {BuildProcessingError}
     *
     * @return {Promise<void>}
     */
    waitForBuildProcessingToComplete(appId: number, platform: PlatformType, version: string, buildNumber: number | string, options?: WaitForBuildProcessingOptions): Promise<void>;
    /**
     * Updates a build
     *
     * @param {string} buildId
     * @param {BuildUpdateOptions} options
     */
    updateBuild(buildId: string, options: BuildUpdateOptions): Promise<void>;
    /**
     * Gets a build
     *
     * @param {string} buildId
     *
     * @returns {Promise<BuildInterface>}
     */
    getBuild(buildId: string): Promise<BuildInterface>;
}
