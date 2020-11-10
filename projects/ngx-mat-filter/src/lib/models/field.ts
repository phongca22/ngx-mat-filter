import moment from 'moment';
import { Operator, Operators } from './operator';
import { Sort, Sorts } from './sort';
import { TYPE } from './type';

export interface IField {
  key: string;
  name: string;
  type?: TYPE;
  sortKey?: string;
  skipFilter?: boolean;
  skipSort?: boolean;
  options?: { id: any; name: any }[];
}

export interface IFilterMatchData {
  actual: any;
  operator: Operator;
  expected: { first: any; second?: any };
}

export interface IFilterLabelData {
  operator: Operator;
  value: { first: any; second?: any };
}

export interface IFilterValueData {
  operator: Operator;
  value: { first: any; second?: any };
}

export abstract class Field implements IField {
  key: string;
  name: string;
  type?: TYPE;
  sortKey?: string;
  skipFilter?: boolean;
  options?: { id: any; name: any }[];
  skipSort?: boolean;

  constructor(data: IField) {
    this.key = data.key;
    this.name = data.name;
    this.type = data.type;
    this.sortKey = data.sortKey;
    this.skipFilter = data.skipFilter;
    this.skipSort = data.skipSort;
    this.options = data.options;
  }

  abstract isMatch(data: IFilterMatchData): boolean;
  abstract getLabel(data: IFilterLabelData): string;
  abstract getValue(data: IFilterValueData): { first: any; second?: any };
  abstract getSort(data: Sort): string;
}

export class TextField extends Field {
  constructor(data: IField) {
    super(data);
    this.type = TYPE.TEXT;
  }

  isMatch(data: IFilterMatchData): boolean {
    let act = data.actual;
    let exp = data.expected.first;
    const operator = data.operator;

    if (Operators.NotEqual === operator) {
      if (exp && !act) {
        return true;
      } else if (!exp && act) {
        return true;
      } else {
        return act.toLowerCase() !== exp.toLowerCase();
      }
    } else {
      if (!act) {
        return false;
      } else if (Operators.Equals === operator) {
        return act.toLowerCase() === exp.toLowerCase();
      } else if (Operators.BeginsWith === operator) {
        return act.toLowerCase().startsWith(exp.toLowerCase());
      } else if (Operators.EndsWith === operator) {
        return act.toLowerCase().endsWith(exp.toLowerCase());
      } else if (Operators.Contains === operator) {
        return act.toLowerCase().includes(exp.toLowerCase());
      } else {
        return false;
      }
    }
  }

  getLabel({ value: { first } }: IFilterLabelData): string {
    return first.toString();
  }

  getValue({ value: { first } }: IFilterValueData): { first: any; second?: any } {
    return {
      first: first
    };
  }

  getSort(data: Sort): string {
    const key = this.sortKey || this.key;
    const first = Sorts.ASC === data ? 'a' : 'b';
    const second = Sorts.ASC === data ? 'b' : 'a';
    return `${first}['${key}'].localeCompare(${second}['${key}'])`;
  }
}

export class SelectField extends Field {
  constructor(data: IField) {
    super(data);
    this.type = TYPE.SELECT;
  }

  isMatch(data: IFilterMatchData): boolean {
    let act = data.actual;
    let exp = data.expected.first;
    const operator = data.operator;

    if (exp != null && act == null) {
      return false;
    } else if (act != null && exp == null) {
      return false;
    } else if (Operators.Equals === operator) {
      return exp.id === act;
    } else if (Operators.NotEqual === operator) {
      return exp.id !== act;
    } else {
      return false;
    }
  }

  getLabel({ value: { first } }: IFilterLabelData): string {
    return first.name.toString();
  }

  getValue({ value: { first } }: IFilterValueData): { first: any; second?: any } {
    return {
      first: this.options.find(({ id }) => id === first.id)
    };
  }

  getSort(data: Sort): string {
    const key = this.sortKey || this.key;
    const first = Sorts.ASC === data ? 'a' : 'b';
    const second = Sorts.ASC === data ? 'b' : 'a';
    return `${first}['${key}'].localeCompare(${second}['${key}'])`;
  }
}

export class AutocompleteField extends SelectField {
  constructor(data: IField) {
    super(data);
    this.type = TYPE.AUTO_COMPLETE;
  }
}

export class NumberField extends Field {
  constructor(data: IField) {
    super(data);
    this.type = TYPE.NUMBER;
  }

  isMatch(data: IFilterMatchData): boolean {
    let act = data.actual;
    let exp = data.expected.first;
    const operator = data.operator;

    if (Operators.NumberRange === operator) {
      var min = data.expected.first;
      var max = data.expected.second;
      if (isNaN(min) || isNaN(max) || isNaN(act)) {
        return false;
      } else {
        min = parseFloat(min);
        max = parseFloat(max);
        act = parseFloat(act);
        return act >= min && act <= max;
      }
    } else if (Operators.NotEqual === operator) {
      if (isNaN(exp) && !isNaN(act)) {
        return true;
      } else if (!isNaN(exp) && isNaN(act)) {
        return true;
      } else {
        return parseFloat(act) !== parseFloat(exp);
      }
    } else {
      if (isNaN(exp) || isNaN(act)) {
        return false;
      } else {
        exp = parseFloat(exp);
        act = parseFloat(act);

        if (Operators.LessThan === operator) {
          return act < exp;
        } else if (Operators.Equals === operator) {
          return act === exp;
        } else if (Operators.GreaterThan === operator) {
          return act > exp;
        } else if (Operators.LessThanOrEquals === operator) {
          return act <= exp;
        } else if (Operators.GreaterThanOrEquals === operator) {
          return act >= exp;
        } else {
          return false;
        }
      }
    }
  }

  getLabel({ operator, value: { first, second } }: IFilterLabelData): string {
    if (Operators.NumberRange === operator) {
      return `${first} - ${second}`;
    } else {
      return first.toString();
    }
  }

  getValue({ operator, value: { first, second } }: IFilterValueData): { first: any; second?: any } {
    if (Operators.NumberRange === operator) {
      return {
        first: first,
        second: second
      };
    } else {
      return {
        first: first
      };
    }
  }

  getSort(data: Sort): string {
    const key = this.sortKey || this.key;
    const first = Sorts.ASC === data ? 'a' : 'b';
    const second = Sorts.ASC === data ? 'b' : 'a';
    return `${first}['${key}'] - ${second}['${key}']`;
  }
}

export class DateField extends Field {
  constructor(data: IField) {
    super(data);
    this.type = TYPE.DATE;
  }

  isMatch(data: IFilterMatchData): boolean {
    let act = data.actual;
    let exp = data.expected.first;
    const operator = data.operator;

    if (Operators.NotEqual === operator) {
      if (act == null || !moment(act).isValid()) {
        return true;
      } else {
        return !moment(act).isSame(moment(exp), 'day');
      }
    } else {
      if (Operators.DateRange === operator) {
        let from = moment(data.expected.first);
        let to = moment(data.expected.second);
        act = moment(act);
        return (
          (from.isBefore(act, 'day') || from.isSame(act, 'day')) && (act.isBefore(to, 'day') || act.isSame(to, 'day'))
        );
      } else {
        act = moment(act);
        exp = moment(exp);

        if (Operators.Equals === operator) {
          return act.isSame(exp, 'day');
        } else if (Operators.Before === operator) {
          return act.isSame(exp, 'day') || act.isBefore(exp, 'day');
        } else if (Operators.After === operator) {
          return act.isSame(exp, 'day') || act.isAfter(exp, 'day');
        } else {
          return false;
        }
      }
    }
  }

  getLabel({ operator, value: { first, second } }: IFilterLabelData): string {
    if (Operators.DateRange === operator) {
      return `${moment(first).format('M/D/YYYY')} - ${moment(second).format('M/D/YYYY')}`;
    } else {
      return moment(first).format('M/D/YYYY');
    }
  }

  getValue({ operator, value: { first, second } }: IFilterValueData): { first: any; second?: any } {
    if (Operators.NumberRange === operator) {
      return {
        first: first,
        second: second
      };
    } else {
      return {
        first: first
      };
    }
  }

  getSort(data: Sort): string {
    const key = this.sortKey || this.key;
    const first = Sorts.ASC === data ? 'a' : 'b';
    const second = Sorts.ASC === data ? 'b' : 'a';
    return `new Date(${first}['${key}']) - new Date(${second}['${key}'])`;
  }
}

export class MultiSelectField extends Field {
  constructor(data: IField) {
    super(data);
    this.type = TYPE.MULTI_SELECT;
  }

  isMatch(data: IFilterMatchData): boolean {
    let act = data.actual;
    let exp = data.expected.first;
    const operator = data.operator;

    if (exp != null && act == null) {
      return false;
    } else if (act != null && exp == null) {
      return false;
    } else if (Operators.Equals === operator) {
      return exp.find(({ id }) => id === act) !== undefined;
    } else if (Operators.NotEqual === operator) {
      return exp.find(({ id }) => id === act) === undefined;
    } else {
      return false;
    }
  }

  getLabel({ value: { first } }: IFilterLabelData): string {
    return first.map(({ name }) => name).join(', ');
  }

  getValue({ value: { first } }: IFilterValueData): { first: any; second?: any } {
    return {
      first: this.options.filter(({ id }) => first.map(({ id }) => id).includes(id))
    };
  }

  getSort(data: Sort): string {
    const key = this.sortKey || this.key;
    const first = Sorts.ASC === data ? 'a' : 'b';
    const second = Sorts.ASC === data ? 'b' : 'a';
    return `${first}['${key}'].localeCompare(${second}['${key}'])`;
  }
}
