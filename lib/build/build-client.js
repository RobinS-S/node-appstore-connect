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
exports.BuildClient = void 0;
const got_1 = require("got");
const constants_1 = require("../constants");
const build_processing_state_1 = require("./build-processing-state");
const build_processing_error_1 = require("./build-processing-error");
class BuildClient {
    /**
     * @param {TokenProvider} tokenProvider
     */
    constructor(tokenProvider) {
        this.tokenProvider = tokenProvider;
    }
    /**
     * Gets the build Id for a build
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {string} buildNumber
     */
    async getBuildId(appId, version, platform, buildNumber) {
        const response = await got_1.default.get(`${constants_1.API_HOST}/v1/builds`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'buffer',
            'searchParams': {
                'fields[builds]': '',
                'filter[app]': appId,
                'filter[version]': buildNumber,
                'filter[preReleaseVersion.version]': version,
                'filter[preReleaseVersion.platform]': platform.toUpperCase(),
            },
            'throwHttpErrors': false,
        });
        if (response.statusCode >= 400) {
            throw new Error(`Error fetching build for app ${appId} with build number (version): ${buildNumber}, version: ${version}, platform: ${platform}. Status code: ${response.statusCode}`);
        }
        const json = JSON.parse(response.body.toString());
        const data = json.data;
        if (data.length > 1) {
            throw new Error(`Received too many results for app ${appId} with build number (version): ${buildNumber}, version: ${version}, platform: ${platform}`);
        }
        if (data.length === 0) {
            throw new Error(`Build not found for app ${appId} with build number (version): ${buildNumber}, version: ${version}, platform: ${platform}`);
        }
        return data[0].id;
    }
    /**
     * Gets status for a build
     *
     * @param {string} buildId
     *
     * @return {Promise<BuildStatus>}
     */
    async getBuildStatusFromBuildId(buildId) {
        const response = await got_1.default.get(`${constants_1.API_HOST}/v1/builds`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'buffer',
            'searchParams': {
                'fields[builds]': 'processingState',
                'filter[id]': buildId,
            },
            'throwHttpErrors': false,
        });
        if (response.statusCode >= 400) {
            throw new Error(`Error fetching build for build id: ${buildId}. Status code: ${response.statusCode}`);
        }
        const json = JSON.parse(response.body.toString());
        const data = json.data;
        if (data.length > 1) {
            throw new Error(`Received too many results for build id: ${buildId}`);
        }
        if (data.length === 0) {
            throw new Error(`Build not found for build id: ${buildId}`);
        }
        const build = data[0];
        return {
            processingState: build.attributes.processingState
        };
    }
    /**
     * Get's the build status for a build
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {string} buildNumber
     */
    async getBuildStatus(appId, version, platform, buildNumber) {
        const response = await got_1.default.get(`${constants_1.API_HOST}/v1/builds`, {
            'headers': {
                'Authorization': `Bearer ${this.tokenProvider.getBearerToken()}`,
                'Accept': 'application/json'
            },
            'responseType': 'buffer',
            'searchParams': {
                'fields[builds]': 'processingState',
                'filter[app]': appId,
                'filter[version]': buildNumber,
                'filter[preReleaseVersion.version]': version,
                'filter[preReleaseVersion.platform]': platform.toUpperCase(),
            },
            'throwHttpErrors': false,
        });
        if (response.statusCode >= 400) {
            throw new Error(`Error fetching build for app ${appId} with build number (version): ${buildNumber}, version: ${version}, platform: ${platform}. Status code: ${response.statusCode}`);
        }
        const json = JSON.parse(response.body.toString());
        const data = json.data;
        if (data.length > 1) {
            throw new Error(`Received too many results for app ${appId} with build number (version): ${buildNumber}, version: ${version}, platform: ${platform}`);
        }
        if (data.length === 0) {
            return {
                processingState: build_processing_state_1.BuildProcessingState.UNKNOWN
            };
        }
        const build = data[0];
        return {
            processingState: build.attributes.processingState
        };
    }
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
    waitForBuildProcessingToComplete(appId, platform, version, buildNumber, options) {
        const opt = options || {};
        const useOptions = Object.assign({ pollIntervalInSeconds: 60, maxTries: 60, initialDelayInSeconds: 0, onPollCallback: () => { } }, opt);
        return new Promise(async (resolve, reject) => {
            const status = await this.getBuildStatus(appId, version, platform, buildNumber);
            const waitStates = [build_processing_state_1.BuildProcessingState.UNKNOWN, build_processing_state_1.BuildProcessingState.PROCESSING];
            const failStates = [build_processing_state_1.BuildProcessingState.FAILED, build_processing_state_1.BuildProcessingState.INVALID];
            if (waitStates.includes(status.processingState)) {
                let tries = 0;
                useOptions.onPollCallback(status.processingState, tries);
                await new Promise((resolve) => {
                    setTimeout(resolve, useOptions.initialDelayInSeconds * 1000);
                });
                const intervalId = setInterval(async () => {
                    const status = await this.getBuildStatus(appId, version, platform, buildNumber);
                    useOptions.onPollCallback(status.processingState, tries);
                    if (failStates.includes(status.processingState)) {
                        clearInterval(intervalId);
                        reject(new build_processing_error_1.BuildProcessingError(status.processingState));
                    }
                    if (status.processingState === build_processing_state_1.BuildProcessingState.VALID) {
                        clearInterval(intervalId);
                        resolve();
                    }
                    tries++;
                    if (tries >= useOptions.maxTries) {
                        clearInterval(intervalId);
                        reject(new build_processing_error_1.BuildProcessingError(build_processing_state_1.BuildProcessingState.UNKNOWN, `Timed out waiting for processing to complete`));
                    }
                }, 1000 * useOptions.pollIntervalInSeconds);
            }
            else {
                if (failStates.includes(status.processingState)) {
                    reject(new build_processing_error_1.BuildProcessingError(status.processingState));
                }
                else {
                    resolve();
                }
            }
        });
    }
}
exports.BuildClient = BuildClient;
//# sourceMappingURL=build-client.js.map