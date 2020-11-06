import { Subject } from 'rxjs';
import { FilterCriteria, FilterDTO, SortCriteria, SortDTO } from './criteria';
import { DataMatching } from './data-matching';
import { Field } from './field';
import { FIELD_TYPE } from './field-type';
import { Operators } from './operator';
import { Sorts } from './sort';
import moment from 'moment';

export class NgxMatFilterWorker {
  filters: FilterCriteria[];
  sorts: SortCriteria[];
  criteriaChange: Subject<any[]>;
  data: any[];
  filtered: any[];
  dataChange: Subject<any[]>;
  batchChange: Subject<any>;
  editFilterEvent: Subject<FilterCriteria>;
  editSortEvent: Subject<SortCriteria>;
  fields: Field[];

  constructor() {
    this.filters = [];
    this.sorts = [];
    this.criteriaChange = new Subject();
    this.dataChange = new Subject();
    this.batchChange = new Subject();
    this.editFilterEvent = new Subject();
    this.editSortEvent = new Subject();
  }

  setFields(data: Field[]) {
    this.fields = data;
  }

  addFilter(item: FilterCriteria, skipUpdate?: boolean) {
    const current = this.filters.find((val) => val.field.key === item.field.key);
    if (current) {
      current.operator = item.operator;
      current.value = item.value;
      current.description = this.getLabelByFilter(current);
    } else {
      const result = new FilterCriteria(item.field, item.operator, item.value);
      result.description = this.getLabelByFilter(result);
      this.filters.push(result);
    }

    if (!skipUpdate) {
      this.update();
    }
  }

  removeFilter(item: FilterCriteria) {
    const index = this.filters.indexOf(item);
    if (index >= 0) {
      this.filters.splice(index, 1);
      this.update();
    }
  }

  addSort(item: SortCriteria, skipUpdate?: boolean) {
    const current = this.sorts.find((val) => val.field.key === item.field.key);
    if (current) {
      current.sort = item.sort;
      current.description = this.getLabelBySort(item);
    } else {
      const result = new SortCriteria(item.field, item.sort);
      result.description = this.getLabelBySort(result);
      this.sorts.push(result);
    }

    if (!skipUpdate) {
      this.update();
    }
  }

  removeSort(item: SortCriteria) {
    const index = this.sorts.indexOf(item);
    if (index >= 0) {
      this.sorts.splice(index, 1);
      this.update();
    }
  }

  update() {
    this.criteriaChange.next([...this.filters, ...this.sorts]);
    if (Array.isArray(this.data)) {
      this.run();
      this.dataChange.next(this.filtered);
    } else {
      this.dataChange.next([]);
    }
  }

  clear() {
    this.filters = [];
    this.sorts = [];
    this.update();
  }

  remove(item: FilterCriteria | SortCriteria) {
    if (item instanceof FilterCriteria) {
      this.removeFilter(item);
    } else {
      this.removeSort(item);
    }
  }

  setBatch(filters: FilterDTO[], sorts: SortDTO[]) {
    this.filters = [];
    this.sorts = [];
    const convertedFilter = this.convertFilter(filters);
    const convertedSort = this.convertSort(sorts);
    convertedFilter.forEach((item: FilterCriteria) => {
      this.addFilter(item, true);
    });

    convertedSort.forEach((item: SortCriteria) => {
      this.addSort(item, true);
    });

    this.batchChange.next({ filters: convertedFilter, sorts: convertedSort });
    this.update();
  }

  private getLabelByFilter(item: FilterCriteria): string {
    const type = item.field.type;
    if (FIELD_TYPE.MULTI_SELECT === type) {
      return item.value.first.map((val: any) => val.name).join(', ');
    } else if (FIELD_TYPE.DATE === type) {
      if (Operators.DateRange === item.operator) {
        return `${moment(item.value.first).format('M/D/YYYY')} - ${moment(item.value.second).format('M/D/YYYY')}`;
      } else {
        return moment(item.value.first).format('M/D/YYYY');
      }
    } else if (FIELD_TYPE.SELECT === type || FIELD_TYPE.AUTO_COMPLETE === type) {
      return item.value.first.name;
    } else if (FIELD_TYPE.NUMBER === item.field.type && Operators.NumberRange === item.operator) {
      return `${item.value.first} - ${item.value.second}`;
    } else {
      return item.value.first.toString();
    }
  }

  private getLabelBySort(item: SortCriteria): string {
    return item.sort.name;
  }

  private convertFilter(data: FilterDTO[]): FilterCriteria[] {
    if (data) {
      return data.map((t: FilterDTO) => {
        const field = this.fields.find(({ key }) => key === t.key);
        return {
          field: field,
          operator: t.operator,
          value: this.convertValue(field, t.value)
        };
      });
    } else {
      return [];
    }
  }

  private convertValue(field: Field, value: { first: any; second?: any }): { first: any; second?: any } {
    if (FIELD_TYPE.AUTO_COMPLETE === field.type || FIELD_TYPE.SELECT === field.type) {
      return {
        first: field.options.find(({ id }) => id === value.first)
      };
    } else if (FIELD_TYPE.MULTI_SELECT === field.type) {
      return {
        first: field.options.filter(({ id }) => value.first.includes(id))
      };
    } else {
      return value;
    }
  }

  private convertSort(data: SortDTO[]): SortCriteria[] {
    if (data) {
      return data.map((t: SortDTO) => ({
        field: this.fields.find(({ key }) => key === t.key),
        sort: t.value
      }));
    } else {
      return [];
    }
  }

  setData(data: any[]) {
    this.data = data;
  }

  private run() {
    let temp = this.data.filter((item: any) => this.isMatch(item));
    if (Array.isArray(this.sorts)) {
      const sortCondition = this.sorts
        .filter((item: SortCriteria) => item.field.skipSort == null)
        .map((item: SortCriteria) => {
          const key = item.field.sortKey || item.field.key;
          const first = Sorts.ASC === item.sort ? 'a' : 'b';
          const second = Sorts.ASC === item.sort ? 'b' : 'a';
          if (
            FIELD_TYPE.TEXT === item.field.type ||
            FIELD_TYPE.MULTI_SELECT === item.field.type ||
            FIELD_TYPE.SELECT === item.field.type ||
            FIELD_TYPE.AUTO_COMPLETE === item.field.type ||
            item.field.sortKey
          ) {
            return `${first}['${key}'].localeCompare(${second}['${key}'])`;
          } else if (FIELD_TYPE.DATE === item.field.type) {
            return `new Date(${first}['${key}']) - new Date(${second}['${key}'])`;
          } else if (FIELD_TYPE.NUMBER === item.field.type) {
            return `${first}['${key}'] - ${second}['${key}']`;
          } else {
            return `${first}['${key}'] > ${second}['${key}']`;
          }
        });

      temp.sort((a: any, b: any) => {
        return eval(`(a, b) => {return ${sortCondition.join('||')}}`)(a, b);
      });
    }

    this.filtered = temp;
  }

  private isMatch(item: any) {
    return new DataMatching(item, this.filters).isMatch;
  }

  destroy() {
    this.criteriaChange.complete();
    this.dataChange.complete();
    this.batchChange.complete();
    this.editFilterEvent.complete();
  }
}
