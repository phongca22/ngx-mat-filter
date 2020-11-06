import { FIELD_TYPE } from './field-type';

export interface Field {
  key: string;
  name: string;
  type: FIELD_TYPE;
  sortKey?: string;
  sort?: boolean;
  filter?: boolean;
  options?: { id: any; name: any }[];
  skipSort?: boolean;
  canEdit?: boolean;
}
