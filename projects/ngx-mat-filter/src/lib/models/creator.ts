import { FilterDTO, SortDTO } from './criteria';
import { Operator } from './operator';
import { Sort } from './sort';

export function createFilter(key: string, operator: Operator, first: any, second?: any): FilterDTO {
  return {
    key: key,
    operator: operator,
    value: {
      first: first,
      second: second
    }
  };
}

export function createSort(key: string, value: Sort): SortDTO {
  return {
    key: key,
    value: value
  };
}
