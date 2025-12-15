"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = (table.getState().columnFilters?.length ?? 0) > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter users..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {/* Role Filter */}
                {table.getColumn("role") && (
                    <Select
                        value={(table.getColumn("role")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) => {
                            if (value === "all") table.getColumn("role")?.setFilterValue(undefined)
                            else table.getColumn("role")?.setFilterValue(value)
                        }}
                    >
                        <SelectTrigger className="h-8 w-[150px]">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="guest">Guest</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                {/* Status Filter */}
                {table.getColumn("is_active") && (
                    <Select
                        value={(table.getColumn("is_active")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) => {
                            if (value === "all") table.getColumn("is_active")?.setFilterValue(undefined)
                            else table.getColumn("is_active")?.setFilterValue(value)
                        }}
                    >
                        <SelectTrigger className="h-8 w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="banned">Banned</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
