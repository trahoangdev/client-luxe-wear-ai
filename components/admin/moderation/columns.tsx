"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Bot, Database, FileText } from "lucide-react"
import { DataTableRowActions } from "./data-table-row-actions"

const getTypeIcon = (type: string) => {
    if (type === 'agent') return Bot;
    if (type === 'knowledge') return Database;
    return FileText;
};

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            const Icon = getTypeIcon(type);
            return (
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="capitalize">{type}</Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "content",
        header: "Content",
        cell: ({ row }) => {
            const content = row.original.content;
            return (
                <div className="flex flex-col max-w-[300px]">
                    <span className="font-medium truncate">
                        {content?.name || content?.title || 'Unknown'}
                    </span>
                    {content?.description && (
                        <span className="text-xs text-muted-foreground truncate">{content.description}</span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "reason",
        header: "Reason",
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate text-sm" title={row.getValue("reason")}>
                {row.getValue("reason")}
            </div>
        ),
    },
    {
        accessorKey: "reportedBy",
        header: "Reported By",
        cell: ({ row }) => (
            <div className="text-sm truncate max-w-[150px]">
                {row.original.reportedBy?.email || 'System'}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            let variant: "default" | "secondary" | "destructive" | "outline" = "default";
            let className = "";

            if (status === 'approved') {
                variant = "default";
                className = "bg-emerald-600 hover:bg-emerald-700";
            } else if (status === 'rejected') {
                variant = "destructive";
            } else if (status === 'pending') {
                variant = "secondary";
                className = "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
            } else {
                variant = "secondary";
            }

            return (
                <Badge variant={variant} className={className + " capitalize"}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "timestamp",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Timestamp
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const d = row.getValue("timestamp") as string;
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
