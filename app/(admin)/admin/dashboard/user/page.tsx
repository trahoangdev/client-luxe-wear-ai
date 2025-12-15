"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminListUsers,
  adminDeleteUser,
  adminBulkDeleteUsers,
  adminBulkUpdateUsers,
  type AdminUser,
  type AdminUserListResponse,
} from "@/services/userService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash, Ban, CheckCircle, Download } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTable } from "@/components/admin/users/data-table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { columns } from "@/components/admin/users/columns";
import { UserViewDialog } from "@/components/admin/users/user-view-dialog";
import { UserEditDialog } from "@/components/admin/users/user-edit-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PaginationState, SortingState, ColumnFiltersState } from "@tanstack/react-table";

export default function AdminUsersPage() {
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Server-side State
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pageCount, setPageCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Dialog State
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const page = pagination.pageIndex + 1;
      const perPage = pagination.pageSize;

      const sortField = sorting[0]?.id;
      const sortOrder = sorting[0]?.desc ? "desc" : "asc";

      const nameFilter = columnFilters.find((f) => f.id === "name")?.value as string;
      const roleFilter = columnFilters.find((f) => f.id === "role")?.value as string;
      const statusValue = columnFilters.find((f) => f.id === "is_active")?.value as string;

      let isActive: boolean | undefined = undefined;
      if (statusValue === "active") isActive = true;
      if (statusValue === "banned") isActive = false;

      const result: AdminUserListResponse = await adminListUsers({
        page,
        perPage,
        q: nameFilter,
        role: roleFilter === "all" ? undefined : roleFilter,
        is_active: isActive,
        sortField,
        sortOrder,
      });

      const list = Array.isArray(result.users) ? result.users : [];
      setAllUsers(list);
      setPageCount(result.totalPages || Math.ceil(result.total / perPage));
      setTotalUsers(result.total);

    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Failed to load users");
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  }, [pagination, sorting, columnFilters]); // Depend on table state

  // Debounce loadData when using filters/search to avoid rapid API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadData]);


  // Handlers passed to DataTable
  const handleView = (user: AdminUser) => {
    setSelected(user);
    setViewOpen(true);
  };

  const handleEdit = (user: AdminUser) => {
    setSelected(user);
    setEditOpen(true);
  };

  // Delete Handler (Open Dialog)
  const handleDeleteClick = (user: AdminUser) => {
    setUserToDelete(user);
    setDeleteOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await adminDeleteUser(userToDelete.id);
      toast.success("User deleted");
      if (selected?.id === userToDelete.id) {
        setSelected(null);
        setViewOpen(false);
        setEditOpen(false);
      }
      setDeleteOpen(false);
      setUserToDelete(null);
      void loadData();
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Failed to delete user");
    }
  };

  const selectedIds = Object.keys(rowSelection);

  const handleBulkDeleteClick = () => {
    if (!selectedIds.length) return;
    setBulkDeleteOpen(true);
  }

  const confirmBulkDelete = async () => {
    try {
      await adminBulkDeleteUsers(selectedIds);
      toast.success(`Deleted ${selectedIds.length} users`);
      setRowSelection({});
      setBulkDeleteOpen(false);
      void loadData();
    } catch (e: unknown) {
      toast.error("Failed to delete users");
    }
  }

  const handleBulkStatusUpdate = async (isActive: boolean) => {
    if (!selectedIds.length) return;
    try {
      const actionIdx = isActive ? "Activated" : "Banned";
      await adminBulkUpdateUsers(selectedIds, { is_active: isActive });
      toast.success(`${actionIdx} ${selectedIds.length} users`);
      setRowSelection({});
      void loadData();
    } catch (e: unknown) {
      toast.error("Failed to update users");
    }
  };

  const handleExport = () => {
    const headers = ["ID", "Name", "Email", "Role", "Status", "Created At"];
    const rows = allUsers.map(u => [
      `"${u.id}"`,
      `"${u.name || ''}"`,
      `"${u.email}"`,
      `"${u.role || ''}"`,
      `"${u.is_active ? "Active" : "Banned"}"`,
      `"${u.created_at || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">Total users: {totalUsers}</p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 ? (
            <TooltipProvider>
              <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border animate-in fade-in slide-in-from-top-2">
                <span className="text-sm font-medium px-2">{selectedIds.length} selected</span>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={handleBulkDeleteClick}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete selected users</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => handleBulkStatusUpdate(false)}>
                      <Ban className="h-4 w-4" />
                      <span className="sr-only">Ban</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ban selected users</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => handleBulkStatusUpdate(true)}>
                      <CheckCircle className="h-4 w-4" />
                      <span className="sr-only">Activate</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Activate selected users</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download list as CSV</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
        {loading ? (
          <TableSkeleton rowCount={pagination.pageSize} columnCount={6} />
        ) : (
          <DataTable
            data={allUsers}
            columns={columns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            // Server-side props
            pageCount={pageCount}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortingChange={setSorting}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
          />
        )}
      </div>

      <UserViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        user={selected}
      />

      <UserEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={selected}
        onSuccess={loadData}
      />

      {/* Single Delete Alert */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Alert */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.length} Users?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected
              user accounts and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
