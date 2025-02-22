/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageableObject } from './PageableObject';
import type { Purchases } from './Purchases';
import type { SortObject } from './SortObject';
export type PagePurchases = {
    totalElements?: number;
    totalPages?: number;
    first?: boolean;
    last?: boolean;
    size?: number;
    content?: Array<Purchases>;
    number?: number;
    sort?: Array<SortObject>;
    numberOfElements?: number;
    pageable?: PageableObject;
    empty?: boolean;
};

