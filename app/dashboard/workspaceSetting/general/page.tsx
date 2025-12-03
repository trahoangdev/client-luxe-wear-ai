"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { getTenantById, updateTenant, deleteTenant as apiDeleteTenant, listUserTenants } from "@/services/tenantService";
import { setTenants, updateTenant as updateTenantStore, removeTenant, setCurrentTenant } from "@/store/tenantSlice";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/\-+/g, "-");
}

export default function WorkspaceGeneralSettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentTenant, tenants } = useAppSelector((s) => s.tenant);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const current = useMemo(() => {
    const list = Array.isArray(tenants) ? tenants : [];
    return list.find((t) => t.id === currentTenant) || null;
  }, [tenants, currentTenant]);

  const [name, setName] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!currentTenant) {
        setLoading(false);
        return;
      }
      try {
        if (!current) {
          const res = await getTenantById(currentTenant);
          const body = (res as any)?.data || res;
          const t = body?.data || body;
          if (t?.id) {
            // sync store list lazily
            try {
              const resList = await listUserTenants();
              const b = (resList as any)?.data || resList;
              const ls = b?.data?.tenants || b?.tenants || [];
              if (Array.isArray(ls)) dispatch(setTenants(ls));
            } catch {}
            setName(t.name || "");
          }
        } else {
          setName(current.name || "");
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentTenant]);

  if (!currentTenant) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">General</h1>
        <Card className="p-6 rounded-2xl border">
          <p className="text-sm text-muted-foreground">Select or create a workspace to edit settings.</p>
        </Card>
      </div>
    );
  }

  const urlSlug = slugify(name || "workspace");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">General</h1>

      <Card className="rounded-2xl border p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ws-name">Workspace name</Label>
          <Input id="ws-name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ws-url">Workspace URL</Label>
          <Input id="ws-url" value={urlSlug} readOnly />
          <p className="text-xs text-muted-foreground">Changing the workspace URL will redirect you to the new address</p>
        </div>
        <div className="pt-2">
          <Button
            onClick={async () => {
              setSaving(true);
              try {
                const res = await updateTenant(currentTenant, { name });
                const body = (res as any)?.data || res;
                const t = body?.data || body;
                dispatch(updateTenantStore({ id: currentTenant, tenant: { name: t?.name || name } }));
                toast.success("Workspace updated");
              } catch (e: any) {
                toast.error(e?.response?.data?.message || "Failed to update workspace");
              } finally {
                setSaving(false);
              }
            }}
            disabled={loading || saving || !name.trim()}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl border p-6">
        <div className="text-xs font-semibold text-red-600 tracking-wider">DANGER ZONE</div>
        <div className="mt-4">
          <div className="text-base font-medium">Delete workspace</div>
          <p className="text-sm text-muted-foreground">Once you delete your workspace, there is no going back. Please be certain. All your uploaded data and trained agents will be deleted.</p>
          <div className="mt-4">
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}>Delete</Button>
          </div>
        </div>
      </Card>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete workspace</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone. Are you sure?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  await apiDeleteTenant(currentTenant);
                  // compute next workspace from current list excluding the deleted one
                  const list = (Array.isArray(tenants) ? tenants : []).filter((t) => t.id !== currentTenant);
                  dispatch(removeTenant(currentTenant));
                  if (list.length > 0) {
                    const nextId = list[0].id;
                    dispatch(setCurrentTenant(nextId));
                    toast.success("Workspace deleted. Switched to another workspace.");
                    router.push("/dashboard");
                  } else {
                    dispatch(setCurrentTenant(null));
                    toast.success("Workspace deleted. Please create or join a workspace.");
                    router.push("/dashboard/join");
                  }
                } catch (e: any) {
                  toast.error(e?.response?.data?.message || "Failed to delete workspace");
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
