"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-medium truncate max-w-[200px]">{row.getValue("name")}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">{row.original.id}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "plan",
        header: "Plan",
        cell: ({ row }) => {
            const plan = row.getValue("plan") as string
            const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
                free: 'secondary',
                pro: 'default',
                enterprise: 'outline', // usually purple or special, but outline works if customized
            };
            // Map to valid Badge variants or use custom class logic inside Badge if strictly needed
            // For now, mapping to shadcn badge variants:
            const variant = colors[plan] || 'secondary';

            return (
                <Badge variant={variant} className="capitalize">
                    {plan || 'free'}
                </Badge>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string

            let variant: "default" | "secondary" | "destructive" | "outline" = "default";
            let className = "";

            if (status === 'active') {
                variant = "default"; // or "success" if we had it, typically green
                className = "bg-emerald-600 hover:bg-emerald-700";
            } else if (status === 'suspended') {
                variant = "destructive";
            } else {
                variant = "secondary";
            }

            return (
                <Badge variant={variant} className={className + " capitalize"}>
                    {status || "active"}
                </Badge>
            )
        },
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
            const d = row.original.createdAt || row.original.created_at;
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
