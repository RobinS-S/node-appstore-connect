"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const sales_client_1 = require("../sales/sales-client");
const token_provider_1 = require("./token-provider");
const build_client_1 = require("../build/build-client");
const release_client_1 = require("../release/release-client");
const testflight_client_1 = require("../testflight/testflight-client");
/**
 * A client for the App Store Connect API.
 */
class Client {
    constructor(salesClient, buildClient, releaseClient, testflightClient) {
        this.salesClient = salesClient;
        this.buildClient = buildClient;
        this.releaseClient = releaseClient;
        this.testflightClient = testflightClient;
    }
    /**
     * Creates an instance of a client to make requests to app store connect API
     *
     * @param {ClientOptions} clientOptions
     */
    static create(clientOptions) {
        const tokenProvider = new token_provider_1.TokenProvider(clientOptions);
        const salesClient = new sales_client_1.SalesClient(tokenProvider);
        const buildClient = new build_client_1.BuildClient(tokenProvider);
        const releaseClient = new release_client_1.ReleaseClient(tokenProvider);
        const testflightClient = new testflight_client_1.TestflightClient(tokenProvider, buildClient);
        return new Client(salesClient, buildClient, releaseClient, testflightClient);
    }
    /**
     * Downloads a summary of a sales report.
     *
     * @param {DownloadSalesReportSummaryOptions} opts The options.
     *
     * @return {Promise<SalesReportRow[]>} The promise with the rows.
     */
    async downloadSalesReportSummary(opts) {
        return this.salesClient.downloadSalesReportSummary(opts);
    }
    /**
     * Returns a summary of app downloads.
     *
     * @param {GetAppDownloadsOptions} opts The options.
     *
     * @return {Promise<GetAppDownloadsResult>} The promise with the result.
     */
    getAppDownloads(opts) {
        return this.salesClient.getAppDownloads(opts);
    }
    /**
     * Attaches a build to a version for release
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {string} buildId
     */
    attachBuildIdToVersion(appId, version, platform, buildId) {
        return this.releaseClient.attachBuildIdToVersion(appId, version, platform, buildId);
    }
    /**
     * Attaches a build to a version for release by version Id
     *
     * @param {string} versionId
     * @param {string} buildId
     */
    attachBuildIdToVersionByVersionId(versionId, buildId) {
        return this.releaseClient.attachBuildIdToVersionByVersionId(versionId, buildId);
    }
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
    ensureVersionExists(appId, version, platform, options) {
        return this.releaseClient.ensureVersionExists(appId, version, platform, options);
    }
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
    createVersion(appId, version, platform, options) {
        return this.releaseClient.createVersion(appId, version, platform, options);
    }
    /**
     * Submits app for review
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {SubmitForReviewOptions?} options
     */
    submitForReview(appId, version, platform, options) {
        return this.releaseClient.submitForReview(appId, version, platform, options);
    }
    /**
     * Submits app for review
     *
     * @param {string} versionId
     * @param {SubmitForReviewOptions?} options
     */
    submitForReviewByVersionId(versionId, options) {
        return this.releaseClient.submitForReviewByVersionId(versionId, options);
    }
    /**
     * Gets the app store version id for a version string
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     */
    getVersionId(appId, version, platform) {
        return this.releaseClient.getVersionId(appId, version, platform);
    }
    /**
     * Gets the build Id for a build
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {string} buildNumber
     */
    getBuildId(appId, version, platform, buildNumber) {
        return this.buildClient.getBuildId(appId, version, platform, buildNumber);
    }
    /**
     * Get's the build status for a build
     *
     * @param {string} buildId
     */
    async getBuildStatusFromBuildId(buildId) {
        return this.buildClient.getBuildStatusFromBuildId(buildId);
    }
    /**
     * Get's the build status for a build
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {string} buildNumber
     */
    getBuildStatus(appId, version, platform, buildNumber) {
        return this.buildClient.getBuildStatus(appId, version, platform, buildNumber);
    }
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
    waitForBuildProcessingToComplete(appId, platform, version, buildNumber, options) {
        return this.buildClient.waitForBuildProcessingToComplete(appId, platform, version, buildNumber, options);
    }
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
    addBuildToExternalGroupByGroupId(appId, version, platform, buildNumber, groupId, options) {
        return this.testflightClient.addBuildToExternalGroupByGroupId(appId, version, platform, buildNumber, groupId, options);
    }
    /**
     * Adds build to external test flight user group. App must be already approved for beta testing perform this function.
     *
     * @param {string} buildId
     * @param {string} groupId
     * @param {AddBuildToExternalGroupOptions?} options
     */
    addBuildToExternalGroupByGroupIdAndBuildId(buildId, groupId, options) {
        return this.testflightClient.addBuildToExternalGroupByGroupIdAndBuildId(buildId, groupId, options);
    }
    /**
     * Notifies beta testers there is a new build
     *
     * @param {string} buildId
     * @param {NotifyBetaTestersOptions?} options
     */
    notifyBetaTestersOfNewBuildByBuildId(buildId, options) {
        return this.testflightClient.notifyBetaTestersOfNewBuildByBuildId(buildId);
    }
    /**
     * Creates or updates localizations by version id
     *
     * @param {string} versionId
     * @param {LocalizationInterface[]} localizations
     */
    setVersionLocalizationsByVersionId(versionId, localizations) {
        return this.releaseClient.setVersionLocalizationsByVersionId(versionId, localizations);
    }
    /**
     * Sets version review details
     *
     * @param {string} versionId
     * @param {ReviewDetailsInterface?} reviewDetails
     */
    setVersionReviewDetailAttributesByVersionId(versionId, reviewDetails) {
        return this.releaseClient.setVersionReviewDetailAttributesByVersionId(versionId, reviewDetails);
    }
    /**
     * Updates a version
     *
     * @param {string} versionId
     * @param {VersionUpdateOptions} attributes
     */
    updateVersionByVersionId(versionId, attributes) {
        return this.releaseClient.updateVersionByVersionId(versionId, attributes);
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map