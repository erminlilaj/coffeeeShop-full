/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MonthlyStatisticsDto } from '../models/MonthlyStatisticsDto';
import type { PagePurchases } from '../models/PagePurchases';
import type { PageSellings } from '../models/PageSellings';
import type { Purchases } from '../models/Purchases';
import type { Sellings } from '../models/Sellings';
import type { TransactionDto } from '../models/TransactionDto';
import type { YearlyStatisticsDTO } from '../models/YearlyStatisticsDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TransactionControllerService {
    /**
     * @param requestBody
     * @returns Sellings OK
     * @throws ApiError
     */
    public static createSell(
        requestBody: TransactionDto,
    ): CancelablePromise<Sellings> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/transactions/sell',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns Purchases OK
     * @throws ApiError
     */
    public static createPurchase(
        requestBody: TransactionDto,
    ): CancelablePromise<Purchases> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/transactions/purchase',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param year
     * @returns YearlyStatisticsDTO OK
     * @throws ApiError
     */
    public static getYearlyStatistics(
        year: number,
    ): CancelablePromise<Array<YearlyStatisticsDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/transactions/yearlyStatistics',
            query: {
                'year': year,
            },
        });
    }
    /**
     * @param page
     * @param size
     * @returns PageSellings OK
     * @throws ApiError
     */
    public static getAllSellings(
        page?: number,
        size: number = 10,
    ): CancelablePromise<PageSellings> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/transactions/sellings',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param page
     * @param size
     * @returns PagePurchases OK
     * @throws ApiError
     */
    public static getAllPurchases(
        page?: number,
        size: number = 10,
    ): CancelablePromise<PagePurchases> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/transactions/purchases',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param month
     * @returns MonthlyStatisticsDto OK
     * @throws ApiError
     */
    public static getMonthlyStatistics(
        month: string,
    ): CancelablePromise<Array<MonthlyStatisticsDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/transactions/monthlyStatistics',
            query: {
                'month': month,
            },
        });
    }
}
