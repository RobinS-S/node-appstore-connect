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
import { SubmitForReviewOptions } from "./submit-for-review-options";
import { PlatformType } from "../client";
import { ReleaseClientInterface } from "./release-client.interface";
import { CreateVersionOptions } from "./create-version-options";
import { EnsureVersionOptions } from "./ensure-version-options";
import { LocalizationInterface } from "./localization.interface";
import { ReviewDetailsInterface } from "./review-details.interface";
import { VersionUpdateOptions } from "./version-update-options";
export declare class ReleaseClient implements ReleaseClientInterface {
    private readonly tokenProvider;
    /**
     * @param {TokenProvider} tokenProvider
     */
    constructor(tokenProvider: TokenProvider);
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
    ensureVersionExists(appId: number, version: string, platform: PlatformType, options?: EnsureVersionOptions): Promise<void>;
    private _updateVersionReleaseType;
    private _updateVersionCode;
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
     * Submits app for review
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     * @param {SubmitForReviewOptions?} options
     */
    submitForReview(appId: number, version: string, platform: PlatformType, options?: SubmitForReviewOptions): Promise<void>;
    /**
     * Gets the app store version id for a version string
     *
     * @param {number} appId
     * @param {string} version
     * @param {PlatformType} platform
     */
    getVersionId(appId: number, version: string, platform: PlatformType): Promise<string>;
    /**
     * Gets the app store version id for a version string.
     *
     * @param {string} versionId
     * @param {SubmitForReviewOptions?} options
     */
    submitForReviewByVersionId(versionId: string, options?: SubmitForReviewOptions): Promise<void>;
    private _setReleaseNotesByVersionId;
    /**
     * Creates or updates version localizations
     *
     * @param {string} versionId
     * @param {LocalizationInterface[]} localizations
     */
    setVersionLocalizationsByVersionId(versionId: string, localizations: LocalizationInterface[]): Promise<void>;
    private _createVersionLocalization;
    private _updateVersionLocalization;
    /**
     * Sets version review details
     *
     * @param {string} versionId
     * @param {ReviewDetailsInterface?} reviewDetails
     */
    setVersionReviewDetailAttributesByVersionId(versionId: string, reviewDetails: ReviewDetailsInterface): Promise<void>;
    _createVersionReviewDetail(versionId: string, reviewDetails: ReviewDetailsInterface): Promise<void>;
    _updateVersionReviewDetail(reviewDetailsId: string, reviewDetails: ReviewDetailsInterface): Promise<void>;
    /**
     * Updates a version
     *
     * @param {string} versionId
     * @param {VersionUpdateOptions} attributes
     */
    updateVersionByVersionId(versionId: string, attributes: VersionUpdateOptions): Promise<void>;
}
