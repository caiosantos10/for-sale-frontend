export interface PagedResponse<T> {
  total: number;
  page: number;
  lastPage: number;
  data: T[];
}
