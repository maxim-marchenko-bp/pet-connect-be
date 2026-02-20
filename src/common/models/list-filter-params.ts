export interface ListFilterParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  excludeIds?: string;
  ids?: string;
}

export interface FilterParamsResult {
  skip: number,
  take: number,
  searchTerm: string,
  excludeIds: number[],
  ids: number[],
  filteredIds: number[], // ids that are included in the results after applying excludeIds filter
}
