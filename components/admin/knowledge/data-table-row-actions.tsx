"use client"

import { Row, Table } from "@tanstack/react-table"
import { MoreHorizontal, Eye, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
    table: Table<TData>
}

export function DataTableRowActions<TData>({
    row,
    table,
}: DataTableRowActionsProps<TData>) {
    const item = row.original as any
    const meta = table.options.meta as any

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    meta?.onView(item);
                }}>
                    <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    View
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        meta?.onDelete(item);
                    }}
                    className="text-red-600 focus:text-red-600"
                >
                    <Trash2 className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Force Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
