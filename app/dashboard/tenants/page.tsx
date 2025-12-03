"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  createTenant,
  listUserTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
  getTenantStats,
  listTenantMembers,
  addTenantMember,
  updateMemberRole,
  removeTenantMember,
} from "@/services/tenantService";
import { retryOnNetworkError } from "@/lib/utils/retry";
import { ErrorState } from "@/components/shared/ErrorState";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTenants, setCurrentTenant, addTenant, updateTenant as updateTenantState, removeTenant as removeTenantState } from "@/store/tenantSlice";
import { useTenant } from "@/lib/hooks/useTenant";
import {
  Plus,
  Building2,
  Users,
  Settings,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Calendar,
} from "lucide-react";

export default function TenantsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentTenant } = useTenant();
  const [tenants, setTenantsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<any | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Create form state
  const [createName, setCreateName] = useState("");
  const [createPlan, setCreatePlan] = useState<"free" | "pro" | "enterprise">("free");
  const [creating, setCreating] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editPlan, setEditPlan] = useState<"free" | "pro" | "enterprise">("free");
  const [editing, setEditing] = useState(false);

  // Load tenants
  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await retryOnNetworkError(
        () => listUserTenants(),
        2
      );
      // Response structure: { data: { tenants: [...], count: ... } } or { data: { data: { tenants: [...] } } }
      const tenantsData = (res as any).data?.data?.tenants || (res as any).data?.tenants || (res as any).tenants || [];
      setTenantsList(Array.isArray(tenantsData) ? tenantsData : []);
      dispatch(setTenants(Array.isArray(tenantsData) ? tenantsData : []));
      
      // Set current tenant if not set
      const validTenants = Array.isArray(tenantsData) ? tenantsData.filter((t: any) => t && t.id) : [];
      if (!currentTenant && validTenants.length > 0) {
        const saved = typeof window !== "undefined" ? localStorage.getItem("currentTenant") : null;
        const tenantId = saved && validTenants.some((t: any) => t.id === saved) ? saved : validTenants[0].id;
        dispatch(setCurrentTenant(tenantId));
      }
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || e?.message || "Failed to load tenants";
      setError(errorMsg);
      toast.error(errorMsg);
      setTenantsList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!createName.trim()) {
      toast.error("Tenant name is required");
      return;
    }
    setCreating(true);
    try {
      const res = await createTenant({ name: createName.trim(), plan: createPlan });
      // Response structure: { success: true, message: '...', data: { tenant: {...} } }
      const newTenant = (res as any).data?.data?.tenant || (res as any).data?.data || (res as any).data?.tenant || (res as any).data || (res as any).tenant || res;
      
      // Validate tenant has required fields
      if (!newTenant || !newTenant.id) {
        console.error("Invalid tenant response:", res);
        toast.error("Failed to create tenant: Invalid response from server");
        return;
      }
      
      setTenantsList((prev) => [...prev, newTenant]);
      dispatch(addTenant(newTenant));
      toast.success("Tenant created successfully");
      setCreateOpen(false);
      setCreateName("");
      setCreatePlan("free");
      
      // Switch to new tenant
      dispatch(setCurrentTenant(newTenant.id));
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to create tenant");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async (tenant: any) => {
    setSelectedTenant(tenant);
    setEditName(tenant.name || "");
    setEditPlan(tenant.plan || "free");
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedTenant || !editName.trim()) {
      toast.error("Tenant name is required");
      return;
    }
    setEditing(true);
    try {
      const res = await updateTenant(selectedTenant.id, {
        name: editName.trim(),
        plan: editPlan,
      });
      // Response structure: { success: true, message: '...', data: { tenant: {...} } }
      const updated = (res as any).data?.data?.tenant || (res as any).data?.data || (res as any).data?.tenant || (res as any).data || (res as any).tenant || res;
      if (!updated || !updated.id) {
        toast.error("Invalid response from server");
        return;
      }
      setTenantsList((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      dispatch(updateTenantState({ id: updated.id, tenant: updated }));
      toast.success("Tenant updated successfully");
      setEditOpen(false);
      setSelectedTenant(null);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to update tenant");
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async (tenantId: string) => {
    try {
      await deleteTenant(tenantId);
      setTenantsList((prev) => prev.filter((t) => t.id !== tenantId));
      dispatch(removeTenantState(tenantId));
      toast.success("Tenant deleted successfully");
      setDeleteConfirm(null);
      
      // Switch to first tenant if current was deleted
      if (currentTenant === tenantId) {
        const remaining = tenants.filter((t) => t.id !== tenantId);
        if (remaining.length > 0) {
          dispatch(setCurrentTenant(remaining[0].id));
        } else {
          dispatch(setCurrentTenant(null));
        }
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to delete tenant");
    }
  };

  const handleSwitchTenant = (tenantId: string) => {
    dispatch(setCurrentTenant(tenantId));
    toast.success("Switched tenant");
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  const loadMembers = async (tenantId: string) => {
    setLoadingMembers(true);
    try {
      const res = await listTenantMembers(tenantId);
      const membersData = (res as any).data?.members || (res as any).data || (res as any).members || [];
      setMembers(Array.isArray(membersData) ? membersData : []);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to load members");
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleOpenMembers = (tenant: any) => {
    setSelectedTenant(tenant);
    setMembersOpen(tenant.id);
    loadMembers(tenant.id);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400";
      case "pro":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400";
      case "suspended":
        return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tenants</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your workspaces and switch between them</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Tenant
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to load tenants"
          description={error}
          onAction={loadTenants}
          actionLabel="Retry"
        />
      ) : tenants.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tenants yet</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              Create your first tenant (workspace) to organize your agents and knowledge base.
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Tenant
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.filter((t) => t && t.id).map((tenant) => (
            <Card key={tenant.id} className={currentTenant === tenant.id ? "border-primary border-2" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {tenant.name || "Unnamed Tenant"}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {tenant.id ? `${tenant.id.slice(0, 8)}...` : "No ID"}
                    </CardDescription>
                  </div>
                  {currentTenant === tenant.id && (
                    <Badge variant="outline" className="bg-primary/10">
                      Current
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getPlanColor(tenant.plan || "free")}>
                    {tenant.plan || "free"}
                  </Badge>
                  <Badge className={getStatusColor(tenant.status || "active")}>
                    {tenant.status || "active"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Created {tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  {currentTenant !== tenant.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSwitchTenant(tenant.id)}
                      className="flex-1"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      Switch
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenMembers(tenant)}
                  >
                    <Users className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(tenant)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(tenant.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Tenant Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tenant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Tenant Name *</Label>
              <Input
                id="create-name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="My Workspace"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-plan">Plan</Label>
              <Select value={createPlan} onValueChange={(v) => setCreatePlan(v as any)}>
                <SelectTrigger id="create-plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating || !createName.trim()}>
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tenant Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tenant Name *</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="My Workspace"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-plan">Plan</Label>
              <Select value={editPlan} onValueChange={(v) => setEditPlan(v as any)}>
                <SelectTrigger id="edit-plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={editing}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={editing || !editName.trim()}>
              {editing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Members Dialog */}
      <Dialog open={!!membersOpen} onOpenChange={(open) => { if (!open) setMembersOpen(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tenant Members</DialogTitle>
          </DialogHeader>
          {loadingMembers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {members.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No members found
                </div>
              ) : (
                members.map((member) => (
                  <div key={member.userId} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-medium">{member.userId}</div>
                      <div className="text-xs text-muted-foreground">
                        Joined {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "N/A"}
                      </div>
                    </div>
                    <Badge>{member.role || "member"}</Badge>
                  </div>
                ))
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMembersOpen(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tenant</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this tenant? This action cannot be undone and will delete all associated data.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => { if (deleteConfirm) handleDelete(deleteConfirm); }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
