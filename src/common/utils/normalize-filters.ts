import { FilterParamsResult, ListFilterParams } from "../models/list-filter-params";

export const normalizeFilters = (filters: ListFilterParams): FilterParamsResult => {
  const { page = 1, pageSize: take = 10, searchTerm = '', ids, excludeIds } = filters;
  const skip = (page - 1) * take;
  const normalizedIds = ids?.split(',').map(Number) || [];
  const normalizedExcludeIds = excludeIds?.split(',').map(Number) || [];
  let filteredIds: number[] = [];

  if (normalizedIds.length && normalizedExcludeIds.length) {
    const idsFilteredByExcludeIds = normalizedIds.filter(id => !normalizedExcludeIds.includes(id));
    if (idsFilteredByExcludeIds.length) {
      filteredIds = [...idsFilteredByExcludeIds];
    }
  } else if (normalizedIds.length && !normalizedExcludeIds.length) {
    filteredIds = [...normalizedIds];
  } else if (!normalizedIds.length && normalizedExcludeIds.length) {
    filteredIds = [...normalizedExcludeIds];
  }

  return {
    skip,
    take,
    searchTerm,
    excludeIds: normalizedExcludeIds,
    ids: normalizedIds,
    filteredIds,
  };
}
