import { TYPE } from './type';
export class Operator {
  id: string;
  name: string;
  short: string;
  type: string[];
}

const Equals: Operator = {
  id: 'eq',
  name: 'Equal',
  short: '=',
  type: [
    TYPE.NUMBER,
    TYPE.TEXT,
    TYPE.DATE,
    TYPE.MULTI_SELECT,
    TYPE.AUTO_COMPLETE,
    TYPE.SELECT
  ]
};

const NotEqual: Operator = {
  id: 'neq',
  name: 'Not Equal',
  short: '<>',
  type: [
    TYPE.NUMBER,
    TYPE.TEXT,
    TYPE.DATE,
    TYPE.MULTI_SELECT,
    TYPE.AUTO_COMPLETE,
    TYPE.SELECT
  ]
};

const LessThanOrEquals: Operator = {
  id: 'ltoe',
  name: 'Less Than Or Equal To',
  short: '<=',
  type: [TYPE.NUMBER]
};

const LessThan: Operator = {
  id: 'lt',
  name: 'Less Than',
  short: '<',
  type: [TYPE.NUMBER]
};

const GreaterThan: Operator = {
  id: 'gt',
  name: 'Greater Than',
  short: '>',
  type: [TYPE.NUMBER]
};

const GreaterThanOrEquals: Operator = {
  id: 'gtoe',
  name: 'Greater Than Or Equal To',
  short: '>=',
  type: [TYPE.NUMBER]
};

const Contains: Operator = {
  id: 'contains',
  name: 'Contains',
  short: 'Contains',
  type: [TYPE.TEXT]
};

const NumberRange: Operator = {
  id: 'numberRange',
  name: 'Range',
  short: 'Range',
  type: [TYPE.NUMBER]
};

const BeginsWith: Operator = {
  id: 'beginsWith',
  name: 'Begins With',
  short: 'Begins With',
  type: [TYPE.TEXT]
};

const EndsWith: Operator = {
  id: 'endsWith',
  name: 'Ends With',
  short: 'End With',
  type: [TYPE.TEXT]
};

const After: Operator = {
  id: 'after',
  name: 'After',
  short: 'After',
  type: [TYPE.DATE]
};

const Before: Operator = {
  id: 'before',
  name: 'Before',
  short: 'Before',
  type: [TYPE.DATE]
};

const DateRange: Operator = {
  id: 'dateRange',
  name: 'Range',
  short: 'Range',
  type: [TYPE.DATE]
};

export const Operators = {
  Equals: Equals,
  NotEqual: NotEqual,
  LessThan: LessThan,
  LessThanOrEquals: LessThanOrEquals,
  GreaterThan: GreaterThan,
  GreaterThanOrEquals: GreaterThanOrEquals,
  Contains: Contains,
  NumberRange: NumberRange,
  BeginsWith: BeginsWith,
  EndsWith: EndsWith,
  After: After,
  Before: Before,
  DateRange: DateRange
};
