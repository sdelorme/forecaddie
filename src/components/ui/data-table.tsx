'use client'

import { useMemo, useState } from 'react'
import {
  type ColumnDef,
  type RowData,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'right'
  }
}

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (!sorted) return <ArrowUpDown className="inline ml-1 h-3 w-3 text-gray-500" />
  if (sorted === 'asc') return <ArrowUp className="inline ml-1 h-3 w-3 text-secondary" />
  return <ArrowDown className="inline ml-1 h-3 w-3 text-secondary" />
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  caption?: string
  filterValue?: string
  filterColumnId?: string
  noResultsMessage?: string
  tableClassName?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  caption,
  filterValue,
  filterColumnId,
  noResultsMessage = 'No results.',
  tableClassName
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columnFilters = useMemo(
    () => (filterColumnId && filterValue ? [{ id: filterColumnId, value: filterValue }] : []),
    [filterColumnId, filterValue]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: filterColumnId ? undefined : filterValue,
      columnFilters
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  return (
    <Table className={tableClassName}>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const align = header.column.columnDef.meta?.align
              return (
                <TableHead
                  key={header.id}
                  className={`${align === 'right' ? 'text-right' : ''} ${
                    header.column.getCanSort() ? 'cursor-pointer select-none hover:text-white transition-colors' : ''
                  }`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanSort() && <SortIcon sorted={header.column.getIsSorted()} />}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const align = cell.column.columnDef.meta?.align
                return (
                  <TableCell key={cell.id} className={align === 'right' ? 'text-right' : ''}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center text-gray-400">
              {noResultsMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
