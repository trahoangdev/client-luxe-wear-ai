"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AdminUser } from "@/services/userService"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTableRowActions } from "./data-table-row-actions"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<AdminUser>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const user = row.original
            return (
                <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar_url || ""} alt={user.name || "User"} />
                        <AvatarFallback>{(user.name || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="truncate font-medium max-w-[150px] sm:max-w-[200px]">{user.name || "Unnamed"}</span>
                        <span className="truncate text-xs text-muted-foreground max-w-[150px] sm:max-w-[200px]">{user.email}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.getValue("role") as string
            return (
                <Badge variant="outline" className="capitalize">
                    {role || "user"}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("is_active")
            return (
                <Badge variant={isActive !== false ? "default" : "destructive"} className={isActive !== false ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
                    {isActive !== false ? "Active" : "Banned"}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            const status = row.getValue(id) !== false ? "active" : "banned"
            return value.includes(status)
        },
    },
    {
        accessorKey: "email_verified",
        header: "Verified",
        cell: ({ row }) => {
            const verified = row.getValue("email_verified")
            return (
                <div className="flex w-[80px] justify-center">
                    {verified ? (
                        <span className="text-emerald-600 font-bold">✓</span>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Joined
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("created_at") as string
            if (!date) return "-"
            return <div className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
        size: 50,
    },
]
