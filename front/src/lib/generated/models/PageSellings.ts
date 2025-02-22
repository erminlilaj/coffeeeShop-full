/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageableObject } from './PageableObject';
import type { Sellings } from './Sellings';
import type { SortObject } from './SortObject';
export type PageSellings = {
    totalElements?: number;
    totalPages?: number;
    first?: boolean;
    last?: boolean;
    size?: number;
    content?: Array<Sellings>;
    number?: number;
    sort?: Array<SortObject>;
    numberOfElements?: number;
    pageable?: PageableObject;
    empty?: boolean;
};

