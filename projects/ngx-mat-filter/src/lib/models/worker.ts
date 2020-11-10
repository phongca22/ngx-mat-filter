import { Observable, Subject } from 'rxjs';
import { FilterCriteria, FilterDTO, SortCriteria, SortDTO } from './criteria';
import { Field } from './field';
import { Sorts } from './sort';
import { TYPE } from './type';

export class NgxMatFilterWorker<T> {
  private filters: FilterCriteria[];
  private sorts: SortCriteria[];
  private criteriaChange: Subject<{ filters: FilterCriteria[]; sorts: SortCriteria[] }>;
  private data: T[];
  private filtered: T[];
  private dataChange: Subject<T[]>;
  private editFilterEvent: Subject<FilterCriteria>;
  private editSortEvent: Subject<SortCriteria>;
  private fields: Field[];

  constructor() {
    this.filters = [];
    this.sorts = [];
    this.criteriaChange = new Subject();
    this.dataChange = new Subject();
    this.editFilterEvent = new Subject();
    this.editSortEvent = new Subject();
  }

  setFields(data: Field[]) {
    this.fields = data;
  }

  addFilter(item: FilterCriteria, skipUpdate?: boolean) {
    let current = this.filters.find((val) => val.field.key === item.field.key);
    if (current) {
      const temp = new FilterCriteria(item.field, item.operator, item.value);
      current.operator = temp.operator;
      current.value = temp.value;
      current.description = temp.description;
    } else {
      const result = new FilterCriteria(item.field, item.operator, item.value);
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
    let current = this.sorts.find((val) => val.field.key === item.field.key);
    if (current) {
      const temp = new SortCriteria(item.field, item.sort);
      current.sort = temp.sort;
      current.description = temp.description;
    } else {
      const result = new SortCriteria(item.field, item.sort);
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
    this.criteriaChange.next({ filters: this.filters, sorts: this.sorts });
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
    const tempFilter = this.parseFilter(filters);
    const tempSort = this.parseSort(sorts);
    tempFilter.forEach((item: FilterCriteria) => {
      this.addFilter(item, true);
    });

    tempSort.forEach((item: SortCriteria) => {
      this.addSort(item, true);
    });

    this.update();
  }

  private parseFilter(data: FilterDTO[]): FilterCriteria[] {
    if (data) {
      return data.map((t: FilterDTO) => {
        const field = this.fields.find(({ key }) => key === t.key);
        return new FilterCriteria(field, t.operator, this.parseValue(field, t.value));
      });
    } else {
      return [];
    }
  }

  private parseValue(field: Field, value: { first: any; second?: any }): { first: any; second?: any } {
    if (TYPE.AUTO_COMPLETE === field.type || TYPE.SELECT === field.type) {
      return {
        first: field.options.find(({ id }) => id === value.first)
      };
    } else if (TYPE.MULTI_SELECT === field.type) {
      return {
        first: field.options.filter(({ id }) => value.first.includes(id))
      };
    } else {
      return value;
    }
  }

  private parseSort(data: SortDTO[]): SortCriteria[] {
    if (data) {
      return data.map(
        (t: SortDTO) =>
          new SortCriteria(
            this.fields.find(({ key }) => key === t.key),
            t.value
          )
      );
    } else {
      return [];
    }
  }

  setData(data: T[]) {
    this.data = data;
  }

  private run() {
    let temp = this.data.filter((item: T) => this.isMatch(item));
    if (Array.isArray(this.sorts)) {
      const sortCondition = this.sorts
        .filter((item: SortCriteria) => !item.field.skipSort)
        .map((item: SortCriteria) => item.field.getSort(item.sort));

      temp.sort((a: T, b: T) => {
        return eval(`(a, b) => {return ${sortCondition.join('||')}}`)(a, b);
      });
    }

    this.filtered = temp;
  }

  private isMatch(data: T) {
    return this.filters.every((filter: FilterCriteria) =>
      filter.field.isMatch({
        actual: data[filter.field.key],
        operator: filter.operator,
        expected: filter.value
      })
    );
  }

  destroy() {
    this.criteriaChange.complete();
    this.dataChange.complete();
    this.editFilterEvent.complete();
    this.editSortEvent.complete();
  }

  getDataChange(): Observable<T[]> {
    return this.dataChange.asObservable();
  }

  getCriteriaChange(): Observable<{ filters: FilterCriteria[]; sorts: SortCriteria[] }> {
    return this.criteriaChange.asObservable();
  }

  getSortEvent(): Observable<SortCriteria> {
    return this.editSortEvent.asObservable();
  }

  getFilterEvent(): Observable<FilterCriteria> {
    return this.editFilterEvent.asObservable();
  }

  editSort(data: SortCriteria): void {
    this.editSortEvent.next(data);
  }

  editFilter(data: FilterCriteria): void {
    this.editFilterEvent.next(data);
  }
}
