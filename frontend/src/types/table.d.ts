import { ColumnDef } from '@tanstack/react-table';

declare global {
  type TableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    pagination?: {
      pageIndex: number;
      pageSize: number;
      pageCount: number;
      onPageChange: (page: number) => void;
    };
    isLoading?: boolean;
  };
} 