"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    PaginationState,
    OnChangeFn,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./user-table-toolbar"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onView?: (user: TData) => void
    onEdit?: (user: TData) => void
    onDelete?: (user: TData) => void
    meta?: Record<string, any>

    // Server-side props
    pageCount?: number
    pagination?: PaginationState
    onPaginationChange?: OnChangeFn<PaginationState>
    sorting?: SortingState
    onSortingChange?: OnChangeFn<SortingState>
    columnFilters?: ColumnFiltersState
    onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
    rowSelection?: Record<string, boolean>
    onRowSelectionChange?: OnChangeFn<Record<string, boolean>>
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onView,
    onEdit,
    onDelete,
    meta,
    pageCount,
    pagination,
    onPaginationChange,
    sorting: controlledSorting,
    onSortingChange,
    columnFilters: controlledColumnFilters,
    onColumnFiltersChange,
    rowSelection: controlledRowSelection,
    onRowSelectionChange: controlledOnRowSelectionChange,
}: DataTableProps<TData, TValue>) {
    const [internalRowSelection, setInternalRowSelection] = React.useState({})
    const rowSelection = controlledRowSelection ?? internalRowSelection;
    const setRowSelection = controlledOnRowSelectionChange ?? setInternalRowSelection;

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

    // Client-side fallback state
    const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([])
    const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
    const [internalPagination, setInternalPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

    const isServerSide = pageCount !== undefined;

    const table = useReactTable({
        data,
        columns,
        pageCount: isServerSide ? pageCount : undefined,
        state: {
            sorting: isServerSide ? (controlledSorting ?? []) : internalSorting,
            columnVisibility,
            rowSelection,
            columnFilters: isServerSide ? (controlledColumnFilters ?? []) : internalColumnFilters,
            pagination: isServerSide ? (pagination ?? { pageIndex: 0, pageSize: 10 }) : internalPagination,
        },
        enableRowSelection: true,
        manualPagination: isServerSide,
        manualSorting: isServerSide,
        manualFiltering: isServerSide,
        onRowSelectionChange: setRowSelection,
        onSortingChange: isServerSide ? onSortingChange : setInternalSorting,
        onColumnFiltersChange: isServerSide ? onColumnFiltersChange : setInternalColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: isServerSide ? onPaginationChange : setInternalPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        meta: {
            onView,
            onEdit,
            onDelete,
            ...meta,
        }
    })

    return (
        <div className="space-y-4">
            <DataTableToolbar table={table} />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
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
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    )
}
