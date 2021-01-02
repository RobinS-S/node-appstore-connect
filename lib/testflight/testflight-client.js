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
exports.TestflightClient = void 0;
const got_1 = require("got");
const constants_1 = require("../constants");
const client_1 = require("../client");
class TestflightClient {
    /**
     * @param {TokenProvider} tokenProvider
     * @param {BuildClient} buildClient
     */
    constructor(tokenProvider, buildClient) {
        this.tokenProvider = tokenProvider;
        this.buildClient = buildClient;
    }
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
    async addBuildToExternalGroupByGroupId(appId, version, platform, buildNumber, groupId, options) {
        const buildId = await this.buildClient.getBuildId(appId, version, platform, buildNumber);
        return this.addBuildToExternalGroupByGroupIdAndBuildId(buildId, groupId);
    }
    /**
     * Adds build to group by group name
     *
     * @param {number} appId
     * @param {string} buildId
     * @param {string} groupName
     * @param {TestflightAddBuildToExternalGroupOptions?} options
     */
    async addBuildToExternalGroupByBuildId(appId, buildId, groupName, options) {
        const opts = options || {};
        const useOptions = Object.assign({ createGroupIfNotExists: true }, opts);
        let groupId;
        if (useOptions.createGroupIfNotExists) {
            groupId = await this.createExternalBetaTestersGroup(appId, groupName);
        }
        else {
            groupId = await this.getExternalBetaTestersGroupId(appId, groupName);
        }
        return this.addBuildToExternalGroupByGroupIdAndBuildId(buildId, groupId, options);
    }
    /**
     * Adds build to external test flight user group. App must be already approved for beta testing perform this function.
     *
     * @param {string} buildId
     * @param {string} groupId
     * @param {TestflightAddBuildToExternalGroupOptions?} options
     */
    async addBuildToExternalGroupByGroupIdAndBuildId(buildId, groupId, options) {
        const opts = options || {};
        const useOptions = Object.assign({ notifyBetaTestersThereIsANewBuild: false }, opts);
        const addResponse = await got_1.default.post(`${constants_1.API_HOST}/v1/builds/${buildId}/relationships/betaGroups`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'json',
            'json': {
                "data": [
                    {
                        "id": groupId,
                        "type": "betaGroups",
                    }
                ]
            },
            'throwHttpErrors': false,
        });
        if (addResponse.statusCode >= 400) {
            const errors = addResponse.body.errors.map(error => error.detail);
            throw new Error(`Error adding build to group for group ${groupId} with build id: ${buildId}. Status code: ${addResponse.statusCode}. Errors: ${errors}`);
        }
        if (useOptions.notifyBetaTestersThereIsANewBuild) {
            await this.notifyBetaTestersOfNewBuildByBuildId(buildId, useOptions.notifyOptions);
        }
    }
    /**
     * Notifies beta testers there is a new build
     *
     * @param {string} buildId
     * @param {TestflightNotifyBetaTestersOptions?} options
     *
     */
    async notifyBetaTestersOfNewBuildByBuildId(buildId, options) {
        const opts = options || {};
        const useOptions = Object.assign({ ignoreIfEnabled: false }, opts);
        const notificationResponse = await got_1.default.post(`${constants_1.API_HOST}/v1/buildBetaNotifications`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'json',
            'json': {
                "data": {
                    "relationships": {
                        "build": {
                            "data": {
                                "id": buildId,
                                "type": "builds"
                            }
                        }
                    },
                    "type": "buildBetaNotifications",
                }
            },
            'throwHttpErrors': false,
        });
        if (notificationResponse.statusCode === 409 && useOptions.ignoreIfEnabled) {
            return;
        }
        if (notificationResponse.statusCode >= 400) {
            const errors = notificationResponse.body.errors.map(error => error.detail);
            throw new Error(`Error sending notification for build id: ${buildId}. Status code: ${notificationResponse.statusCode}. Errors: ${errors}`);
        }
    }
    /**
     * Creates an external group
     *
     * @param {number} appId
     * @param {string} groupName
     * @param {TestflightCreateGroupOptions?} options
     *
     * @returns Promise<string> A promise with the group id
     */
    async createExternalBetaTestersGroup(appId, groupName, options) {
        const opts = options || {};
        const useOptions = Object.assign({ allowDuplicates: false }, opts);
        if (!useOptions.allowDuplicates) {
            try {
                return await this.getExternalBetaTestersGroupId(appId, groupName);
            }
            catch (e) {
                if (e.statusCode !== 404) {
                    throw e;
                }
            }
        }
        const createGroupResponse = await got_1.default.post(`${constants_1.API_HOST}/v1/betaGroups`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'json',
            'json': {
                data: {
                    attributes: {
                        name: groupName
                    },
                    relationships: {
                        app: {
                            data: {
                                id: appId,
                                type: "apps"
                            }
                        }
                    },
                    type: "betaGroups",
                }
            },
            'throwHttpErrors': false,
        });
        if (createGroupResponse.statusCode >= 400) {
            const errors = createGroupResponse.body.errors.map(error => error.detail);
            throw new Error(`Error sending notification for group name: ${groupName}. Status code: ${createGroupResponse.statusCode}. Errors: ${errors}`);
        }
        const data = createGroupResponse.body.data;
        return data.id;
    }
    /**
     * Gets an external beta testing group ID by app ID and group name
     *
     * @param {number} appId
     * @param {string} groupName
     *
     * @throws {ApiError | Error}
     * @returns Promise<string> A promise with the group id
     */
    async getExternalBetaTestersGroupId(appId, groupName) {
        const response = await got_1.default.get(`${constants_1.API_HOST}/v1/betaGroups`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'json',
            'searchParams': {
                'fields[apps]': '',
                'filter[app]': appId,
                'filter[name]': groupName,
            },
            'throwHttpErrors': false,
        });
        if (response.statusCode >= 400) {
            throw new Error(`Error fetching build for app ${appId} with group name: ${groupName}. Status code: ${response.statusCode}`);
        }
        const data = response.body.data;
        if (data.length > 1) {
            throw new Error(`Received too many results for app ${appId} with group name: ${groupName}`);
        }
        if (data.length === 0) {
            throw new client_1.ApiError(`Group not found for app ${appId} with group name: ${groupName}`, 404);
        }
        return data[0].id;
    }
}
exports.TestflightClient = TestflightClient;
//# sourceMappingURL=testflight-client.js.map