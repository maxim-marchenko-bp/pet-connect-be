import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

export type FilterOperator = 'eq' | 'neq' | 'in' | 'notIn' | 'like' | 'ilike' | 'gt' | 'gte' | 'lt' | 'lte' | 'isNull' | 'isNotNull';

export interface FilterConfig<T = any> {
  field: string; // The database field path (e.g., 'type.code', 'pet.name')
  operator?: FilterOperator; // Default: 'eq'
  paramName?: string; // The parameter name to use in the query (optional, defaults to filter key)
  type?: 'string' | 'number' | 'boolean' | 'date'; // Optional type hint for value parsing
}

export type FilterConfigMap<T = any> = {
  [key: string]: FilterConfig<T> | string; // String is shorthand for { field: string, operator: 'eq' }
};

/**
 * Applies custom filters to a query builder based on a configuration map
 * @param queryBuilder - The TypeORM SelectQueryBuilder instance
 * @param filters - The filter parameters object
 * @param filterConfig - Configuration mapping filter keys to database fields and operators
 * @returns The extended query builder with filters applied
 * 
 * @example
 * const filterConfig = {
 *   type: 'type.code', // Shorthand for { field: 'type.code', operator: 'eq' }
 *   status: { field: 'pet.status', operator: 'eq' },
 *   age: { field: 'pet.age', operator: 'gte' },
 * };
 * applyCustomFilters(queryBuilder, filters, filterConfig);
 */
export const applyCustomFilters = <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  filters: Record<string, any>,
  filterConfig: FilterConfigMap<T>
): SelectQueryBuilder<T> => {
  Object.entries(filterConfig).forEach(([filterKey, config]) => {
    const filterValue = filters[filterKey];

    // Skip if filter value is undefined, null, or empty string
    if (filterValue === undefined || filterValue === null || filterValue === '') {
      return;
    }

    // Normalize config: if it's a string, convert to full config object
    const normalizedConfig: FilterConfig = typeof config === 'string'
      ? { field: config, operator: 'eq', type: 'string' }
      : { operator: 'eq', ...config };

    const { field, operator, paramName, type } = normalizedConfig;
    const isDateType = type === 'date';
    const param = paramName || filterKey;

    // Build the where clause based on operator
    switch (operator) {
      case 'eq':
        queryBuilder.andWhere(`${field} = :${param}`, { [param]: filterValue });
        break;
      
      case 'neq':
        queryBuilder.andWhere(`${field} != :${param}`, { [param]: filterValue });
        break;
      
      case 'in':
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          queryBuilder.andWhere(`${field} IN (:...${param})`, { [param]: filterValue });
        }
        break;
      
      case 'notIn':
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          queryBuilder.andWhere(`${field} NOT IN (:...${param})`, { [param]: filterValue });
        }
        break;
      
      case 'like':
        queryBuilder.andWhere(`${field} LIKE :${param}`, { [param]: `%${filterValue}%` });
        break;
      
      case 'ilike':
        queryBuilder.andWhere(`${field} ILIKE :${param}`, { [param]: `%${filterValue}%` });
        break;
      
      case 'gt':
        const gtValue = isDateType ? filterValue : Number(filterValue);
        if ((!isDateType && !isNaN(gtValue)) || (isDateType && gtValue)) {
          queryBuilder.andWhere(`${field} > :${param}`, { [param]: gtValue });
        }
        break;
      
      case 'gte':
        const gteValue = isDateType ? filterValue : Number(filterValue);
        if ((!isDateType && !isNaN(gteValue)) || (isDateType && gteValue)) {
          queryBuilder.andWhere(`${field} >= :${param}`, { [param]: gteValue });
        }
        break;
      
      case 'lt':
        const ltValue = isDateType ? filterValue : Number(filterValue);
        if ((!isDateType && !isNaN(ltValue)) || (isDateType && ltValue)) {
          queryBuilder.andWhere(`${field} < :${param}`, { [param]: ltValue });
        }
        break;
      
      case 'lte':
        const lteValue = isDateType ? filterValue : Number(filterValue);
        if ((!isDateType && !isNaN(lteValue)) || (isDateType && lteValue)) {
          queryBuilder.andWhere(`${field} <= :${param}`, { [param]: lteValue });
        }
        break;
      
      case 'isNull':
        if (filterValue === true || filterValue === 'true') {
          queryBuilder.andWhere(`${field} IS NULL`);
        }
        break;
      
      case 'isNotNull':
        if (filterValue === true || filterValue === 'true') {
          queryBuilder.andWhere(`${field} IS NOT NULL`);
        }
        break;
      
      default:
        console.warn(`Unknown filter operator: ${operator}`);
    }
  });

  return queryBuilder;
};

