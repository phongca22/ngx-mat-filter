export interface Sort {
  id: string;
  name: string;
}

export const Sorts = {
  ASC: <Sort>{ id: 'asc', name: 'Ascending' },
  DESC: <Sort>{
    id: 'desc',
    name: 'Descending'
  }
};
