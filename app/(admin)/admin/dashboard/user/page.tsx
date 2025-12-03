"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  adminListUsers,
  adminUpdateUser,
  adminDeleteUser,
  adminResetPassword,
  type AdminUser,
  type AdminUserListResponse,
} from "@/services/userService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Search, Filter, X, Columns2, Check, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminUsersPage() {
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]); // Store all filtered/sorted users
  const [users, setUsers] = useState<AdminUser[]>([]); // Displayed users (paginated)
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState<string>("all");
  
  // Sort state
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    avatar: true,
    name: true,
    email: true,
    role: true,
    status: true,
    email_verified: true,
    id: false,
    actions: true,
  });
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editRole, setEditRole] = useState<string>("user");
  const [editActive, setEditActive] = useState<boolean>(true);
  const [editName, setEditName] = useState<string>("");
  const [editEmail, setEditEmail] = useState<string>("");
  // ban/reset actions are available via buttons in the dialog footer
  const [showResetPwd, setShowResetPwd] = useState<boolean>(false);
  const [resetPwdValue, setResetPwdValue] = useState<string>("");

  // Load data from API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load all users (or a large number) to enable client-side filtering/sorting
      const result: AdminUserListResponse = await adminListUsers({
        page: 1,
        perPage: 1000, // Load more data to enable client-side operations
        q: q.trim() || undefined,
      });
      const list = Array.isArray(result.users) ? result.users : [];
      setAllUsers(list);
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Failed to load users");
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  }, [q]);

  // Process data: filter, sort, and paginate
  useEffect(() => {
    let list = [...allUsers];
    
    // Apply client-side filters
    if (roleFilter !== "all") {
      list = list.filter((user) => user.role === roleFilter);
    }
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      list = list.filter((user) => (user.is_active !== false) === isActive);
    }
    if (emailVerifiedFilter !== "all") {
      const isVerified = emailVerifiedFilter === "verified";
      list = list.filter((user) => !!user.email_verified === isVerified);
    }
    
    // Apply sorting
    list.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortField) {
        case "name":
          aValue = (a.name || "").toLowerCase();
          bValue = (b.name || "").toLowerCase();
          break;
        case "email":
          aValue = (a.email || "").toLowerCase();
          bValue = (b.email || "").toLowerCase();
          break;
        case "role":
          aValue = (a.role || "").toLowerCase();
          bValue = (b.role || "").toLowerCase();
          break;
        case "status":
          aValue = a.is_active !== false ? 1 : 0;
          bValue = b.is_active !== false ? 1 : 0;
          break;
        case "email_verified":
          aValue = a.email_verified ? 1 : 0;
          bValue = b.email_verified ? 1 : 0;
          break;
        case "last_login":
          aValue = a.last_login ? new Date(a.last_login).getTime() : 0;
          bValue = b.last_login ? new Date(b.last_login).getTime() : 0;
          break;
        case "created_at":
        default:
          aValue = a.created_at ? new Date(a.created_at).getTime() : 0;
          bValue = b.created_at ? new Date(b.created_at).getTime() : 0;
          break;
      }
      
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    
    // Calculate total after filtering
    const totalCount = list.length;
    
    // Apply pagination after sorting and filtering
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedList = list.slice(startIndex, endIndex);

    setUsers(paginatedList);
    setTotal(totalCount);
  }, [allUsers, roleFilter, statusFilter, emailVerifiedFilter, sortField, sortOrder, page, perPage]);

  // Load data when search query changes (with debounce)
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1); // Reset to page 1 when search changes
      void loadData();
    }, 400);
    return () => clearTimeout(t);
  }, [q, loadData]);

  // Load data on initial mount
  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setPage(1);
  }, [roleFilter, statusFilter, emailVerifiedFilter, sortField, sortOrder]);

  const hasActiveFilters = roleFilter !== "all" || statusFilter !== "all" || emailVerifiedFilter !== "all";
  
  const clearFilters = () => {
    setRoleFilter("all");
    setStatusFilter("all");
    setEmailVerifiedFilter("all");
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const onChangeRole = async (id: string, role: string) => {
    try {
      await adminUpdateUser(id, { role });
      toast.success("Role updated");
      void loadData();
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Failed to update role");
    }
  };

  const allColumns: ColumnsType<AdminUser> = [
    {
      title: "Avatar",
      dataIndex: "avatar_url",
      key: "avatar_url",
      render: (url: string) => (
        <Avatar src={url || "/images/avatar-default.jpg"} />
      ),
    },
    {
      title: "Name / Role",
      dataIndex: "name",
      key: "name",
      render: (_: unknown, user: AdminUser) => (
        <div className="space-y-1">
          <div className="font-medium">{user.name || "-"}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="truncate max-w-[160px]">{user.email}</span>
            {user.role && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                {user.role}
              </span>
            )}
          </div>
        </div>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_: unknown, u: AdminUser) => (
        <Select
          value={u.role || "user"}
          onValueChange={(v) => onChangeRole(u.id, v)}
        >
          <SelectTrigger className="h-8 w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="super_admin">super_admin</SelectItem>
            <SelectItem value="admin">admin</SelectItem>
            <SelectItem value="member">member</SelectItem>
            <SelectItem value="user">user</SelectItem>
            <SelectItem value="guest">guest</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (v: boolean) =>
        v === false ? (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
            banned
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
            active
          </span>
        ),
    },
    {
      title: "Email verified",
      dataIndex: "email_verified",
      key: "email_verified",
      render: (v: boolean) => String(!!v),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (v: string) => (
        <span className="break-all inline-block max-w-[260px] align-middle">
          {v}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      render: (_: unknown, user: AdminUser) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelected(user);
              setViewOpen(true);
            }}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelected(user);
              setEditRole(user.role || "user");
              setEditActive(!(user.is_active === false));
              setEditName(user.name || "");
              setEditEmail(user.email || "");
              setShowResetPwd(false);
              setResetPwdValue("");
              setEditOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              if (!window.confirm("Delete this user? This action cannot be undone.")) {
                return;
              }
              try {
                await adminDeleteUser(user.id);
                toast.success("User deleted");
                if (selected?.id === user.id) {
                  setSelected(null);
                  setViewOpen(false);
                  setEditOpen(false);
                }
                void loadData();
              } catch (e: unknown) {
                const error = e as { response?: { data?: { message?: string } } };
                toast.error(error?.response?.data?.message || "Failed to delete user");
              }
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Column labels mapping
  const columnLabels: Record<string, string> = {
    avatar: "Avatar",
    name: "Name / Role",
    email: "Email",
    role: "Role",
    status: "Status",
    email_verified: "Email Verified",
    id: "ID",
    actions: "Actions",
  };

  // Toggle column visibility
  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  // Filter columns based on visibility
  const filteredColumns = allColumns.filter((col) => {
    const key = col.key as string;
    if (key === "avatar_url") return visibleColumns.avatar;
    if (key === "name") return visibleColumns.name;
    if (key === "email") return visibleColumns.email;
    if (key === "role") return visibleColumns.role;
    if (key === "is_active") return visibleColumns.status;
    if (key === "email_verified") return visibleColumns.email_verified;
    if (key === "id") return visibleColumns.id;
    if (key === "actions") return visibleColumns.actions;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name or email"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-72 pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Columns2 className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(columnLabels).map(([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleColumn(key);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 w-full">
                    {visibleColumns[key] && <Check className="h-4 w-4" />}
                    {!visibleColumns[key] && <div className="h-4 w-4" />}
                    <span>{label}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Select
            value={String(perPage)}
            onValueChange={(v) => {
              setPerPage(parseInt(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}/page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filters:</span>
          </div>
          
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v)}>
            <SelectTrigger className="w-[160px]">
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

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>

          <Select value={emailVerifiedFilter} onValueChange={(v) => setEmailVerifiedFilter(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Email Verified" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="not_verified">Not Verified</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Sort Controls */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
          </div>
          
          <Select value={sortField} onValueChange={(v) => setSortField(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Created Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="role">Role</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="email_verified">Email Verified</SelectItem>
              <SelectItem value="last_login">Last Login</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="gap-2"
          >
            {sortOrder === "asc" ? (
              <>
                <ArrowUp className="h-4 w-4" />
                Ascending
              </>
            ) : (
              <>
                <ArrowDown className="h-4 w-4" />
                Descending
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl border overflow-x-auto p-2">
        <Table<AdminUser>
          size="middle"
          rowKey="id"
          columns={filteredColumns}
          dataSource={users}
          loading={loading}
          pagination={false}
          scroll={{ x: 1200 }}
        />
      </Card>

      {Math.ceil(total / perPage) > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="py-2 px-4 text-sm">
            {page} / {Math.ceil(total / perPage)}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setPage((p) => Math.min(Math.ceil(total / perPage), p + 1))
            }
            disabled={page >= Math.ceil(total / perPage)}
          >
            Next
          </Button>
        </div>
      )}

      {/* View dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User details</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {selected.name || "-"}
              </div>
              <div>
                <span className="font-medium">Email:</span> {selected.email}
              </div>
              <div>
                <span className="font-medium">Role:</span>{" "}
                {selected.role || "user"}
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                {selected.is_active === false ? "banned" : "active"}
              </div>
              <div>
                <span className="font-medium">Email verified:</span>{" "}
                {String(!!selected.email_verified)}
              </div>
              <div>
                <span className="font-medium">Phone:</span>{" "}
                {selected.phone || "-"}
              </div>
              <div>
                <span className="font-medium">Website:</span>{" "}
                {selected.website || "-"}
              </div>
              <div>
                <span className="font-medium">Last login:</span>{" "}
                {selected.last_login
                  ? new Date(selected.last_login).toLocaleString()
                  : "-"}
              </div>
              <div>
                <span className="font-medium">Created:</span>{" "}
                {selected.created_at
                  ? new Date(selected.created_at).toLocaleString()
                  : "-"}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{" "}
                {selected.updated_at
                  ? new Date(selected.updated_at).toLocaleString()
                  : "-"}
              </div>
              <div>
                <span className="font-medium">ID:</span>{" "}
                <span className="break-all inline-block max-w-[260px] align-middle">
                  {selected.id}
                </span>
              </div>
              <div>
                <span className="font-medium">Password hash:</span>{" "}
                {selected.password_hash
                  ? String(selected.password_hash).slice(0, 24) + "…"
                  : "-"}
              </div>
              <div>
                <span className="font-medium">Preferences:</span>{" "}
                {(() => {
                  try {
                    const s = JSON.stringify(selected.preferences || {});
                    return s.slice(0, 60) + (s.length > 60 ? "…" : "");
                  } catch {
                    return "-";
                  }
                })()}
              </div>
              <div>
                <span className="font-medium">Avatar URL:</span>{" "}
                <span className="break-all inline-block max-w-[260px] align-middle">
                  {selected.avatar_url || "-"}
                </span>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Name</div>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Email</div>
              <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Role</div>
              <Select value={editRole} onValueChange={(v) => setEditRole(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">super_admin</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
                  <SelectItem value="member">member</SelectItem>
                  <SelectItem value="user">user</SelectItem>
                  <SelectItem value="guest">guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Status</div>
              <Select value={editActive ? 'active' : 'banned'} onValueChange={(v) => setEditActive(v === 'active')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">active</SelectItem>
                  <SelectItem value="banned">banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {showResetPwd && (
              <div className="space-y-2 md:col-span-2">
                <div className="text-xs text-muted-foreground">New password</div>
                <Input type="password" value={resetPwdValue} onChange={(e) => setResetPwdValue(e.target.value)} placeholder="Enter new password" />
              </div>
            )}
          </div>
          <DialogFooter>
            <div className="mr-auto flex gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  if (!selected) return;
                  try {
                    const newActive = !editActive;
                    await adminUpdateUser(selected.id, { is_active: newActive });
                    setEditActive(newActive);
                    toast.success(newActive ? "User unbanned" : "User banned");
                    void loadData();
                  } catch (e: unknown) {
                    const error = e as { response?: { data?: { message?: string } } };
                    toast.error(error?.response?.data?.message || "Failed to update status");
                  }
                }}
              >
                {editActive ? 'Ban' : 'Unban'}
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  if (!selected) return;
                  if (!showResetPwd) {
                    setShowResetPwd(true);
                    setResetPwdValue("");
                    return;
                  }
                  try {
                    await adminResetPassword(selected.id, resetPwdValue || undefined);
                    toast.success(
                      resetPwdValue ? "Password reset" : "Temporary password generated",
                    );
                    setShowResetPwd(false);
                    setResetPwdValue("");
                  } catch (e: unknown) {
                    const error = e as { response?: { data?: { message?: string } } };
                    toast.error(error?.response?.data?.message || "Failed to reset password");
                  }
                }}
              >
                Reset pwd
              </Button>
            </div>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!selected) return;
                try {
                  await adminUpdateUser(selected.id, {
                    role: editRole,
                    is_active: editActive,
                    name: editName.trim() || undefined,
                    email: editEmail.trim() || undefined,
                  });
                  toast.success("User updated");
                  setEditOpen(false);
                  void loadData();
                } catch (e: unknown) {
                  const error = e as { response?: { data?: { message?: string } } };
                  toast.error(error?.response?.data?.message || "Failed to update user");
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
