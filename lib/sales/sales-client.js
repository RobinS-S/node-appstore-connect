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
exports.SalesClient = void 0;
const utils_1 = require("../client/utils");
const moment = require("moment");
const got_1 = require("got");
const download_sales_report_frequency_1 = require("./download-sales-report-frequency");
const constants_1 = require("../constants");
class SalesClient {
    constructor(tokenProvider) {
        this.tokenProvider = tokenProvider;
    }
    /**
     * Downloads a summary of a sales report.
     *
     * @param {DownloadSalesReportSummaryOptions} opts The options.
     *
     * @return {Promise<SalesReportRow[]>} The promise with the rows.
     */
    async downloadSalesReportSummary(opts) {
        let reportDate = opts.date;
        if (utils_1.isNil(reportDate)) {
            reportDate = moment();
        }
        if (!moment.isMoment(reportDate)) {
            reportDate = moment(reportDate);
        }
        let frequency = opts.frequency;
        if (utils_1.isNil(frequency)) {
            frequency = download_sales_report_frequency_1.DownloadSalesReportFrequency.Weekly;
        }
        let filterReportDate;
        switch (frequency) {
            case download_sales_report_frequency_1.DownloadSalesReportFrequency.Weekly:
                reportDate = moment(reportDate.toDate()).endOf('isoWeek');
                filterReportDate = reportDate.format('YYYY-MM-DD');
                break;
            case download_sales_report_frequency_1.DownloadSalesReportFrequency.Monthly:
                filterReportDate = reportDate.format('YYYY-MM');
                break;
            case download_sales_report_frequency_1.DownloadSalesReportFrequency.Yearly:
                filterReportDate = reportDate.format('YYYY');
                break;
            default:
                filterReportDate = reportDate.format('YYYY-MM-DD');
                break;
        }
        const TOKEN = this.tokenProvider.getBearerToken();
        const RESPONSE = await got_1.default.get(`${constants_1.API_HOST}/v1/salesReports`, {
            'headers': {
                'Authorization': 'Bearer ' + TOKEN,
                'Accept': 'application/a-gzip'
            },
            'responseType': 'buffer',
            'searchParams': {
                'filter[frequency]': frequency,
                'filter[reportDate]': filterReportDate,
                'filter[reportType]': 'SALES',
                'filter[reportSubType]': 'SUMMARY',
                'filter[vendorNumber]': opts.vendorId,
            },
            'throwHttpErrors': false,
        });
        if (200 !== RESPONSE.statusCode) {
            if (404 === RESPONSE.statusCode) {
                return [];
            }
            throw new Error(`Unexpected Response: [${RESPONSE.statusCode}] '${RESPONSE.body}'`);
        }
        const ZIPPED_CSV = RESPONSE.body;
        const ALL_ROWS = await utils_1.readCSV(await utils_1.gunzip(ZIPPED_CSV, 'utf8'));
        const ROWS = [];
        const FILTER = utils_1.isNil(opts.filter) ?
            () => true : opts.filter;
        for (const R of ALL_ROWS) {
            if (await FILTER(R)) {
                ROWS.push(R);
            }
        }
        return ROWS;
    }
    /**
     * Returns a summary of app downloads.
     *
     * @param {GetAppDownloadsOptions} opts The options.
     *
     * @return {Promise<GetAppDownloadsResult>} The promise with the result.
     */
    async getAppDownloads(opts) {
        const CSV = await this.downloadSalesReportSummary(opts);
        const RESULT = {
            apps: {},
        };
        for (const R of CSV) {
            let item = RESULT.apps[R.SKU];
            if (utils_1.isNil(item)) {
                RESULT.apps[R.SKU] = item = {
                    downloads: 0,
                };
            }
            let units = parseInt(R.Units);
            item.downloads += isNaN(units) ?
                0 : units;
        }
        return RESULT;
    }
}
exports.SalesClient = SalesClient;
//# sourceMappingURL=sales-client.js.map