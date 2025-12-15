"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className="flex flex-col max-w-[300px]">
                <span className="font-medium truncate">{row.getValue("title") || '(No title)'}</span>
                {row.original.content && (
                    <span className="text-xs text-muted-foreground truncate">
                        {String(row.original.content).substring(0, 100)}...
                    </span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "agent.name",
        header: "Agent",
        cell: ({ row }) => row.original.agent?.name || '-',
    },
    {
        accessorKey: "user.email",
        header: "User",
        cell: ({ row }) => row.original.user?.email || '-',
    },
    {
        accessorKey: "tenant.name",
        header: "Tenant",
        cell: ({ row }) => row.original.tenant?.name || '-',
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const d = row.getValue("createdAt") || row.original.created_at;
            if (!d) return "-";
            return (
                <div className="flex flex-col">
                    <span className="text-sm">{new Date(d).toLocaleDateString()}</span>
                    <span className="text-xs text-muted-foreground">{new Date(d).toLocaleTimeString()}</span>
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
    },
]
