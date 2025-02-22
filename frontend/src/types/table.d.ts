import { ColumnDef, SortingState } from '@tanstack/react-table';

export type TableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  pagination?: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    onPageChange: (page: number) => void;
  };
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  isLoading?: boolean;
};