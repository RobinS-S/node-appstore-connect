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
exports.ReleaseClient = void 0;
const client_1 = require("../client");
const got_1 = require("got");
const constants_1 = require("../constants");
class ReleaseClient {
    /**
     * @param {TokenProvider} tokenProvider
     */
    constructor(tokenProvider) {
        this.tokenProvider = tokenProvider;
    }
    /**
     * Creates a version for release if it does not already exist
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {EnsureVersionOptions?} options
     *
     * @return {Promise<void>}
     */
    async ensureVersionExists(appId, version, platform, options) {
        const opts = options || {};
        const useOptions = Object.assign({ updateVersionStringIfUnreleasedVersionExists: false }, opts);
        const response = await got_1.default.get(`${constants_1.API_HOST}/v1/apps/${appId}/appStoreVersions`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'json',
            'searchParams': {
                'fields[apps]': '',
                'filter[versionString]': version,
                'filter[platform]': platform,
            },
            'throwHttpErrors': false,
        });
        if (response.statusCode >= 400) {
            const errors = response.body.errors.map(error => error.detail);
            throw new Error(`Error fetching version for app ${appId} with version: ${version}, platform: ${platform}. Status code: ${response.statusCode}. Errors: ${errors}`);
        }
        const data = response.body.data;
        if (data.length > 1) {
            throw new Error(`Received too many results for app ${appId}, version: ${version}, platform: ${platform}`);
        }
        if (data.length === 0) {
            try {
                await this.createVersion(appId, version, platform, useOptions.createOptions);
            }
            catch (e) {
                const error = e;
                if (error.statusCode === 409 && useOptions.updateVersionStringIfUnreleasedVersionExists) {
                    await this._updateVersionCode(appId, version, platform);
                }
                else {
                    throw e;
                }
            }
        }
    }
    async _updateVersionCode(appId, version, platform) {
        const statusesThatCanBeUpdated = [
            "DEVELOPER_REMOVED_FROM_SALE",
            "DEVELOPER_REJECTED",
            "INVALID_BINARY",
            "METADATA_REJECTED",
            "PENDING_CONTRACT",
            "PENDING_DEVELOPER_RELEASE",
            "PREPARE_FOR_SUBMISSION",
            "REJECTED",
            "REMOVED_FROM_SALE",
            "WAITING_FOR_EXPORT_COMPLIANCE"
        ];
        const getResponse = await got_1.default.get(`${constants_1.API_HOST}/v1/apps/${appId}/appStoreVersions`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'json',
            'searchParams': {
                'fields[apps]': '',
                'filter[platform]': platform,
                'filter[appStoreState]': statusesThatCanBeUpdated.join(','),
            },
            'throwHttpErrors': false,
        });
        if (getResponse.statusCode >= 400) {
            const errors = getResponse.body.errors.map(error => error.detail);
            throw new Error(`Error fetching version for app ${appId} with version: ${version}, platform: ${platform}. Status code: ${getResponse.statusCode}. Errors: ${errors}`);
        }
        const data = getResponse.body.data;
        if (data.length > 1) {
            throw new Error(`Received too many results for app ${appId}, version: ${version}, platform: ${platform} when trying to update the version number`);
        }
        if (data.length === 0) {
            throw new Error(`Version could not found for app ${appId}, platform: ${platform} when trying to update version to ${version}`);
        }
        const appStoreVersion = data[0];
        const appStoreVersionId = appStoreVersion.id;
        const patchResponse = await got_1.default.patch(`${constants_1.API_HOST}/v1/appStoreVersions/${appStoreVersionId}`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'json',
            'json': {
                "data": {
                    "id": appStoreVersionId,
                    "type": "appStoreVersions",
                    "attributes": {
                        "versionString": version,
                    },
                }
            },
            'throwHttpErrors': false,
        });
        if (patchResponse.statusCode >= 400) {
            const errors = patchResponse.body.errors.map(error => error.detail);
            throw new Error(`Error when trying to update version for app ${appId} with version: ${version}, platform: ${platform}. Status code: ${patchResponse.statusCode}. Errors: ${errors}`);
        }
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
    async createVersion(appId, version, platform, options) {
        const defaultOptions = {
            autoRelease: false,
            copyright: "",
            usesIdfa: false
        };
        const opts = options || {};
        const useOptions = Object.assign(Object.assign({}, defaultOptions), opts);
        const response = await got_1.default.post(`${constants_1.API_HOST}/v1/appStoreVersions`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'json',
            'throwHttpErrors': false,
            'json': {
                "data": {
                    "type": "appStoreVersions",
                    "attributes": {
                        "platform": platform,
                        "versionString": version,
                        "copyright": options.copyright,
                        "releaseType": useOptions.autoRelease ? "AFTER_APPROVAL" : "MANUAL",
                        "usesIdfa": useOptions.usesIdfa
                    },
                    "relationships": {
                        "app": {
                            "data": {
                                "type": "apps",
                                "id": appId.toString()
                            }
                        }
                    }
                }
            }
        });
        if (response.statusCode >= 400) {
            const errors = response.body.errors.map(error => error.detail);
            throw new client_1.ApiError(`Error creating version for app ${appId}, version: ${version}, platform: ${platform}. Status code: ${response.statusCode}. Errors: ${errors.join(', ')}`, response.statusCode);
        }
    }
    /**
     * Attaches a build to a version for release
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {string} buildId
     */
    async attachBuildIdToVersion(appId, version, platform, buildId) {
        const appStoreVersionId = await this.getVersionId(appId, version, platform);
        const patchResponse = await got_1.default.patch(`${constants_1.API_HOST}/v1/appStoreVersions/${appStoreVersionId}/relationships/build`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'json',
            'json': {
                "data": {
                    "id": buildId,
                    "type": "builds",
                }
            },
            'throwHttpErrors': false,
        });
        if (patchResponse.statusCode >= 400) {
            const errors = patchResponse.body.errors.map(error => error.detail);
            throw new Error(`Error when trying to update version for app ${appId} with version: ${version}, platform: ${platform}. Status code: ${patchResponse.statusCode}. Errors: ${errors}`);
        }
    }
    /**
     * Attaches a build to a version for release by version Id
     *
     * @param {string} versionId
     * @param {string} buildId
     */
    async attachBuildIdToVersionByVersionId(versionId, buildId) {
        const patchResponse = await got_1.default.patch(`${constants_1.API_HOST}/v1/appStoreVersions/${versionId}/relationships/build`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'json',
            'json': {
                "data": {
                    "id": buildId,
                    "type": "builds",
                }
            },
            'throwHttpErrors': false,
        });
        if (patchResponse.statusCode >= 400) {
            const errors = patchResponse.body.errors.map(error => error.detail);
            throw new Error(`Error when trying to update version id: ${versionId} with build id: ${buildId}. Status code: ${patchResponse.statusCode}. Errors: ${errors}`);
        }
    }
    /**
     * Submits app for review
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {SubmitForReviewOptions?} options
     */
    async submitForReview(appId, version, platform, options) {
        const versionId = await this.getVersionId(appId, version, platform);
        return this.submitForReviewByVersionId(versionId);
    }
    /**
     * Gets the app store version id for a version string
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     */
    async getVersionId(appId, version, platform) {
        const response = await got_1.default.get(`${constants_1.API_HOST}/v1/apps/${appId}/appStoreVersions`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'json',
            'searchParams': {
                'fields[apps]': '',
                'filter[platform]': platform,
                'filter[versionString]': version
            },
            'throwHttpErrors': false,
        });
        if (response.statusCode >= 400) {
            const errors = response.body.errors.map(error => error.detail);
            throw new Error(`Error fetching version for app ${appId} with version: ${version}, platform: ${platform}. Status code: ${response.statusCode}. Errors: ${errors}`);
        }
        const data = response.body.data;
        if (data.length > 1) {
            throw new Error(`Received too many results for app ${appId} with version: ${version}, platform: ${platform}`);
        }
        if (data.length === 0) {
            throw new Error(`Version not found for app ${appId} with version: ${version}, platform: ${platform}`);
        }
        const appStoreVersion = data[0];
        return appStoreVersion.id;
    }
    /**
     * Gets the app store version id for a version string.
     *
     * @param {string} versionId
     * @param {SubmitForReviewOptions?} options
     */
    async submitForReviewByVersionId(versionId, options) {
        const response = await got_1.default.post(`${constants_1.API_HOST}/v1/appStoreVersionSubmissions`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'json',
            'json': {
                "data": {
                    "relationships": {
                        "appStoreVersion": {
                            "data": {
                                "id": versionId,
                                "type": "appStoreVersions"
                            }
                        }
                    },
                    "type": "appStoreVersionSubmissions",
                }
            },
            'throwHttpErrors': false,
        });
        if (response.statusCode >= 400) {
            const errors = response.body.errors.map(error => error.detail);
            throw new Error(`Error submit app for approval for version id: ${versionId}. Status code: ${response.statusCode}. Errors: ${errors}`);
        }
    }
}
exports.ReleaseClient = ReleaseClient;
//# sourceMappingURL=release-client.js.map