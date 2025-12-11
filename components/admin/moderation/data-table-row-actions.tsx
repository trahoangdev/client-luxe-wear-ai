"use client"

import { Row, Table } from "@tanstack/react-table"
import { MoreHorizontal, Eye, CheckCircle, XCircle, Ban } from "lucide-react"

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
                    Review
                </DropdownMenuItem>
                {item.status === 'pending' && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault();
                            meta?.onApprove(item);
                        }}>
                            <CheckCircle className="mr-2 h-3.5 w-3.5 text-emerald-600" />
                            Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault();
                            meta?.onReject(item);
                        }}>
                            <XCircle className="mr-2 h-3.5 w-3.5 text-red-600" />
                            Reject
                        </DropdownMenuItem>
                        {item.content?.owner?.id && (
                            <DropdownMenuItem onSelect={(e) => {
                                e.preventDefault();
                                meta?.onBanUser(item.content.owner.id);
                            }}>
                                <Ban className="mr-2 h-3.5 w-3.5 text-red-600" />
                                Ban User
                            </DropdownMenuItem>
                        )}
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
