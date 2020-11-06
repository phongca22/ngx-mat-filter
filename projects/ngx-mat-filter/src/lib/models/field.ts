import { TYPE } from './field-type';

export interface Field {
  key: string;
  name: string;
  type: TYPE;
  sortKey?: string;
  sort?: boolean;
  filter?: boolean;
  options?: { id: any; name: any }[];
  skipSort?: boolean;
  canEdit?: boolean;
}
