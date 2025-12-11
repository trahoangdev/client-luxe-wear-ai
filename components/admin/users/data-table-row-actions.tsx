"use client"

import { Row, Table } from "@tanstack/react-table"
import { MoreHorizontal, SquarePen, Trash2, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdminUser } from "@/services/userService"

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
    table: Table<TData>
}

// Define the interface for your table meta
interface TableMeta {
    onView: (user: AdminUser) => void
    onEdit: (user: AdminUser) => void
    onDelete: (user: AdminUser) => void
}

export function DataTableRowActions<TData>({
    row,
    table,
}: DataTableRowActionsProps<TData>) {
    const user = row.original as AdminUser
    const meta = table.options.meta as TableMeta
    console.log("Row Actions Meta:", meta, "User:", user);

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
                    meta?.onView(user);
                }}>
                    <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    View
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    meta?.onEdit(user);
                }}>
                    <SquarePen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        meta?.onDelete(user);
                    }}
                    className="text-red-600 focus:text-red-600"
                >
                    <Trash2 className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
