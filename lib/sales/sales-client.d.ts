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
import { SalesReportRow } from "./sales-report-row";
import { TokenProvider } from "../client/token-provider";
import { DownloadSalesReportSummaryOptions } from "./download-sales-report-summary-options";
import { GetAppDownloadsOptions } from "./get-app-downloads-options";
import { GetAppDownloadsResult } from "./get-app-downloads-result";
export declare class SalesClient {
    private readonly tokenProvider;
    constructor(tokenProvider: TokenProvider);
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
}
