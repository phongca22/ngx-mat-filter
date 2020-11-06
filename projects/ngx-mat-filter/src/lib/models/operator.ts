import { FIELD_TYPE } from './field-type';
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
    FIELD_TYPE.NUMBER,
    FIELD_TYPE.TEXT,
    FIELD_TYPE.DATE,
    FIELD_TYPE.MULTI_SELECT,
    FIELD_TYPE.AUTO_COMPLETE,
    FIELD_TYPE.SELECT
  ]
};

const NotEqual: Operator = {
  id: 'neq',
  name: 'Not Equal',
  short: '<>',
  type: [
    FIELD_TYPE.NUMBER,
    FIELD_TYPE.TEXT,
    FIELD_TYPE.DATE,
    FIELD_TYPE.MULTI_SELECT,
    FIELD_TYPE.AUTO_COMPLETE,
    FIELD_TYPE.SELECT
  ]
};

const LessThanOrEquals: Operator = {
  id: 'ltoe',
  name: 'Less Than Or Equal To',
  short: '<=',
  type: [FIELD_TYPE.NUMBER]
};

const LessThan: Operator = {
  id: 'lt',
  name: 'Less Than',
  short: '<',
  type: [FIELD_TYPE.NUMBER]
};

const GreaterThan: Operator = {
  id: 'gt',
  name: 'Greater Than',
  short: '>',
  type: [FIELD_TYPE.NUMBER]
};

const GreaterThanOrEquals: Operator = {
  id: 'gtoe',
  name: 'Greater Than Or Equal To',
  short: '>=',
  type: [FIELD_TYPE.NUMBER]
};

const Contains: Operator = {
  id: 'contains',
  name: 'Contains',
  short: 'Contains',
  type: [FIELD_TYPE.TEXT]
};

const NumberRange: Operator = {
  id: 'numberRange',
  name: 'Range',
  short: 'Range',
  type: [FIELD_TYPE.NUMBER]
};

const BeginsWith: Operator = {
  id: 'beginsWith',
  name: 'Begins With',
  short: 'Begins With',
  type: [FIELD_TYPE.TEXT]
};

const EndsWith: Operator = {
  id: 'endsWith',
  name: 'Ends With',
  short: 'End With',
  type: [FIELD_TYPE.TEXT]
};

const After: Operator = {
  id: 'after',
  name: 'After',
  short: 'After',
  type: [FIELD_TYPE.DATE]
};

const Before: Operator = {
  id: 'before',
  name: 'Before',
  short: 'Before',
  type: [FIELD_TYPE.DATE]
};

const DateRange: Operator = {
  id: 'dateRange',
  name: 'Range',
  short: 'Range',
  type: [FIELD_TYPE.DATE]
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
