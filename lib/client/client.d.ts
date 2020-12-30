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
import { DownloadSalesReportSummaryOptions, GetAppDownloadsOptions, GetAppDownloadsResult, SalesReportRow } from "../sales";
import { SalesClient } from "../sales/sales-client";
import { ClientOptions } from "./client-options";
import { BuildClient } from "../build/build-client";
import { ReleaseClient } from "../release/release-client";
import { TestflightClient } from "../testflight/testflight-client";
import { BuildClientInterface } from "../build/build-client.interface";
import { CreateVersionOptions, EnsureVersionOptions, PlatformType, SubmitForReviewOptions } from "../release";
import { WaitForBuildProcessingOptions } from "../build";
import { ReleaseClientInterface } from "../release/release-client.interface";
import { AddBuildToExternalGroupOptions } from "../testflight";
import { TestflightClientInterface } from "../testflight/testflight-client.interface";
/**
 * A client for the App Store Connect API.
 */
export declare class Client implements BuildClientInterface, ReleaseClientInterface, TestflightClientInterface {
    private readonly salesClient;
    private readonly buildClient;
    private readonly releaseClient;
    private readonly testflightClient;
    static create(clientOptions: ClientOptions): Client;
    constructor(salesClient: SalesClient, buildClient: BuildClient, releaseClient: ReleaseClient, testflightClient: TestflightClient);
    /**
     * Downloads a summary of a sales report.
     *
     * @param {DownloadSalesReportSummaryOptions} opts The options.
     *
     * @return {Promise<SalesReportRow[]>} The promise with the rows.
     */
    downloadSalesReportSummary(opts: DownloadSalesReportSummaryOptions): Promise<SalesReportRow[]>;
    /**
     * Returns a summary of app downloads.
     *
     * @param {GetAppDownloadsOptions} opts The options.
     *
     * @return {Promise<GetAppDownloadsResult>} The promise with the result.
     */
    getAppDownloads(opts: GetAppDownloadsOptions): Promise<GetAppDownloadsResult>;
    /**
     * Attaches a build to a version for release
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {string} buildId
     */
    attachBuildIdToVersion(appId: number, version: string, platform: PlatformType, buildId: string): Promise<void>;
    /**
     * Attaches a build to a version for release by version Id
     *
     * @param {string} versionId
     * @param {string} buildId
     */
    attachBuildIdToVersionByVersionId(versionId: string, buildId: string): Promise<void>;
    /**
     * Creates a version for release if it does not already exist
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {EnsureVersionOptions} options
     *
     * @return {Promise<void>}
     */
    ensureVersionExists(appId: number, version: string, platform: PlatformType, options: EnsureVersionOptions): Promise<void>;
    /**
     * Creates a new version for sale
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {CreateVersionOptions?} options
     *
     * @return {Promise<void>}
     */
    createVersion(appId: number, version: string, platform: PlatformType, options?: CreateVersionOptions): Promise<void>;
    /**
     * Submits app for review
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {SubmitForReviewOptions?} options
     */
    submitForReview(appId: number, version: string, platform: PlatformType, options?: SubmitForReviewOptions): Promise<void>;
    /**
     * Submits app for review
     *
     * @param {string} versionId
     * @param {SubmitForReviewOptions?} options
     */
    submitForReviewByVersionId(versionId: string, options?: SubmitForReviewOptions): Promise<void>;
    /**
     * Gets the app store version id for a version string
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     */
    getVersionId(appId: number, version: string, platform: PlatformType): Promise<string>;
    /**
     * Gets the build Id for a build
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {string} buildNumber
     */
    getBuildId(appId: number, version: string, platform: PlatformType, buildNumber?: number): Promise<string>;
    /**
     * Get's the build status for a build
     *
     * @param {string} buildId
     */
    getBuildStatusFromBuildId(buildId: string): Promise<import("../build").BuildStatus>;
    /**
     * Get's the build status for a build
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {string} buildNumber
     */
    getBuildStatus(appId: number, version: string, platform: PlatformType, buildNumber?: number): Promise<import("../build").BuildStatus>;
    /**
     * Waits for build processing to complete. Throws error if build is invalid. Waits indefinitely if build does not exist.
     *
     * @param {number} appId
     * @param {PlatformType} platform
     * @param {string} version
     * @param {number} buildNumber
     * @param {WaitForBuildProcessingOptions} options
     *
     * @throws {BuildProcessingError}
     *
     * @return {Promise<void>}
     */
    waitForBuildProcessingToComplete(appId: number, platform: PlatformType, version: string, buildNumber: number, options?: WaitForBuildProcessingOptions): Promise<void>;
    /**
     * Adds build to external test flight user group. App must be already approved for beta testing perform this function.
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {number} buildNumber
     * @param {string} groupId
     * @param {AddBuildToExternalGroupOptions?} options
     */
    addBuildToExternalGroupByGroupId(appId: number, version: string, platform: PlatformType, buildNumber: number, groupId: string, options?: AddBuildToExternalGroupOptions): Promise<void>;
    /**
     * Adds build to external test flight user group. App must be already approved for beta testing perform this function.
     *
     * @param {string} buildId
     * @param {string} groupId
     * @param {AddBuildToExternalGroupOptions?} options
     */
    addBuildToExternalGroupByGroupIdAndBuildId(buildId: string, groupId: string, options?: AddBuildToExternalGroupOptions): Promise<void>;
    /**
     * Notifies beta testers there is a new build
     *
     * @param {string} buildId
     */
    notifyBetaTestersOfNewBuildByBuildId(buildId: string): Promise<void>;
}
