import { FilterDTO, SortDTO } from './criteria';
import { IField, AutocompleteField, NumberField, SelectField, TextField, MultiSelectField, DateField } from './field';
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

export function createTextField(data: IField) {
  return new TextField(data);
}

export function createSelectField(data: IField) {
  return new SelectField(data);
}

export function createAutocompleteField(data: IField) {
  return new AutocompleteField(data);
}

export function createNumberField(data: IField) {
  return new NumberField(data);
}

export function createMultiSelectField(data: IField) {
  return new MultiSelectField(data);
}

export function createDateField(data: IField) {
  return new DateField(data);
}
