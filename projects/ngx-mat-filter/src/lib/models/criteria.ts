import { Field } from './field';
import { Operator } from './operator';
import { Sort } from './sort';

abstract class Criteria {
  field: Field;
  description?: string;

  constructor(field: Field) {
    this.field = field;
  }
}

export class SortCriteria extends Criteria {
  sort: Sort;

  constructor(field: Field, sort: Sort) {
    super(field);
    this.sort = sort;
  }
}

export class FilterCriteria extends Criteria {
  operator: Operator;
  value?: {
    first: any;
    second?: any;
  };

  constructor(field: Field, operator: Operator, value: any) {
    super(field);
    this.operator = operator;
    this.value = value;
  }
}

export interface FilterDTO {
  key: string;
  operator: Operator;
  value: {
    first: any;
    second?: any;
  };
}

export interface SortDTO {
  key: string;
  value: Sort;
}
