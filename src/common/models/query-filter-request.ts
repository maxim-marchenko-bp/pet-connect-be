import { ListFilterParams } from "./list-filter-params";
import { Request } from 'express';

export type QueryFilterRequest = Request & { query: ListFilterParams };
