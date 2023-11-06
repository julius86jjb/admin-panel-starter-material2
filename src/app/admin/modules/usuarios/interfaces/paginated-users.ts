import { User } from '../../../../auth/interfaces/user.interface';


export interface PaginatedUsers {
  page:       string;
  per_page:   number;
  total:      number;
  page_total: number;
  users:      User[];
}

