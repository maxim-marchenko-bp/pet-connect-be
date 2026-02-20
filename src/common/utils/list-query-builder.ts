import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { FilterParamsResult } from "../models/list-filter-params";

export const listQueryBuilder = <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  filters: FilterParamsResult,
  entityAlias: string,
  searchableFields: (keyof T)[]
): SelectQueryBuilder<T> => {
  const { ids, excludeIds, searchTerm, skip, take, filteredIds } = filters;

  if (ids?.length && excludeIds?.length && !filteredIds.length) {
    queryBuilder.andWhere('1=0');
  }else if (ids?.length && excludeIds?.length && filteredIds?.length) {
    queryBuilder.andWhere(`${entityAlias}.id IN (:...filteredIds)`, { filteredIds });
  } else if (ids?.length) {
    queryBuilder.andWhere(`${entityAlias}.id IN (:...ids)`, { ids });
  } else if (excludeIds?.length) {
    queryBuilder.andWhere(`${entityAlias}.id NOT IN (:...excludeIds)`, { excludeIds });
  }

  if (searchTerm) {
    searchableFields.forEach((searchableField, i) => {
      const where = `${entityAlias}.${searchableField.toString()} ILIKE :searchTerm`;
      const params = { searchTerm: `%${searchTerm}%` };
      if (i === 0) {
        queryBuilder.andWhere(where, params);
      } else {
        queryBuilder.orWhere(where, params);
      }
    });
  }

  return queryBuilder.skip(skip).take(take);
}
