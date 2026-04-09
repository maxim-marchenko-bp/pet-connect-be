import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'in'
  | 'notIn'
  | 'like'
  | 'ilike'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'isNull'
  | 'isNotNull';

export interface FilterConfig<T = any> {
  field: string;
  operator?: FilterOperator;
  paramName?: string;
  type?: 'string' | 'number' | 'boolean' | 'date';
}

export type FilterConfigMap<T = any> = {
  [key: string]: FilterConfig<T> | string;
};

const parseValue = (value: any, type?: string) => {
  if (value === undefined || value === null || value === '') return null;

  switch (type) {
    case 'number': {
      const num = Number(value);
      return isNaN(num) ? null : num;
    }
    case 'boolean':
      return value === true || value === 'true';
    default:
      return value;
  }
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
    const rawValue = filters[filterKey];

    if (rawValue === undefined || rawValue === null || rawValue === '') return;

    const normalizedConfig: FilterConfig =
      typeof config === 'string'
        ? { field: config, operator: 'eq', type: 'string' }
        : { operator: 'eq', ...config };

    const { field, operator, paramName, type } = normalizedConfig;
    const param = paramName || filterKey;

    const parsedValue = parseValue(rawValue, type);
    if (parsedValue === null && operator !== 'isNull' && operator !== 'isNotNull') return;

    switch (operator) {
      case 'eq':
        queryBuilder.andWhere(`${field} = :${param}`, { [param]: parsedValue });
        break;

      case 'neq':
        queryBuilder.andWhere(`${field} != :${param}`, { [param]: parsedValue });
        break;

      case 'in':
        if (Array.isArray(rawValue) && rawValue.length > 0) {
          queryBuilder.andWhere(`${field} IN (:...${param})`, { [param]: rawValue });
        }
        break;

      case 'notIn':
        if (Array.isArray(rawValue) && rawValue.length > 0) {
          queryBuilder.andWhere(`${field} NOT IN (:...${param})`, { [param]: rawValue });
        }
        break;

      case 'like':
        queryBuilder.andWhere(`${field} LIKE :${param}`, { [param]: `%${rawValue}%` });
        break;

      case 'ilike':
        queryBuilder.andWhere(`${field} ILIKE :${param}`, { [param]: `%${rawValue}%` });
        break;

      case 'gt':
        queryBuilder.andWhere(`${field} > :${param}`, { [param]: parsedValue });
        break;

      case 'gte':
        queryBuilder.andWhere(`${field} >= :${param}`, { [param]: parsedValue });
        break;

      case 'lt':
        queryBuilder.andWhere(`${field} < :${param}`, { [param]: parsedValue });
        break;

      case 'lte':
        queryBuilder.andWhere(`${field} <= :${param}`, { [param]: parsedValue });
        break;

      case 'isNull':
        if (rawValue === true || rawValue === 'true') {
          queryBuilder.andWhere(`${field} IS NULL`);
        }
        break;

      case 'isNotNull':
        if (rawValue === true || rawValue === 'true') {
          queryBuilder.andWhere(`${field} IS NOT NULL`);
        }
        break;

      default:
        console.warn(`Unknown filter operator: ${operator}`);
    }
  });

  return queryBuilder;
};

