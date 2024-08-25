export type PaginationState = {
  pageSize: number;
  page: number;
  total_pages?: number;
  total_rows?: number;
};

type SortState = {
  column?: string;
  kind?: "asc" | "desc";
};

export type FilterState<T> = {
  filters?: T;
};

type SearchState = {
  q?: string;
};

export type QueryState<T extends object> = PaginationState &
  SortState &
  FilterState<T> &
  SearchState;

export type QueryStateURL<T extends object> = PaginationState &
  SortState &
  SearchState &
  T;
