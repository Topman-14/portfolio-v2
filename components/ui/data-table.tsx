/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAlert } from '@/context/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DeleteConfig {
  onDelete: (id: string) => Promise<void>;
  title: string;
  nameKey: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  rowNavigate?: string;
  deleteConfig?: DeleteConfig;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  rowNavigate,
  deleteConfig,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const handleRowClick = (row: TData & { id: string }) => {
    if (rowNavigate && row?.id) {
      router.push(`${rowNavigate}/${row?.id}`);
    }
  };

  const columnsWithActions = useMemo(() => {
    if (!deleteConfig) return columns;

    const actionsColumn: ColumnDef<TData, TValue> = {
      id: 'actions',
      cell: ({ row }) => {
        const item = row.original as TData & { id: string };

        const handleDelete = (e: React.MouseEvent) => {
          e.stopPropagation();

          showAlert({
            title: deleteConfig.title,
            content: `Are you sure you want to delete "${
              (item as any)[deleteConfig?.nameKey]
            }"? This action cannot be undone.`,
            onConfirm: () => deleteConfig.onDelete((item as any).id),
          });
        };

        return (
          <div className='opacity-0 group-hover:opacity-100 transition-opacity'>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0 text-destructive hover:text-destructive'
              onClick={handleDelete}
            >
              <Trash className='h-4 w-4' />
            </Button>
          </div>
        );
      },
    };

    return [...columns, actionsColumn];
  }, [columns, deleteConfig, showAlert]);

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className='space-y-4'>
      {searchKey && (
        <div className='flex items-center py-4'>
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
        </div>
      )}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={
                    rowNavigate
                      ? 'group cursor-pointer hover:bg-muted/50'
                      : 'group'
                  }
                  onClick={() =>
                    handleRowClick(row.original as TData & { id: string })
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsWithActions.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
