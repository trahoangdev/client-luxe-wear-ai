"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UsersRound } from "lucide-react";
import { createTenant, listUserTenants } from "@/services/tenantService";
import { useAppDispatch } from "@/store";
import { addTenant, setCurrentTenant, setTenants } from "@/store/tenantSlice";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function JoinWorkspacePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [plan, setPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [inviteCode, setInviteCode] = useState("");
  const [errors, setErrors] = useState<{ name?: string } >({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // preload tenants to help user if they already have workspaces
    (async () => {
      try {
        const res = await listUserTenants();
        const body = (res as any)?.data || res;
        const data = body?.data?.tenants || body?.tenants || [];
        if (Array.isArray(data)) dispatch(setTenants(data));
      } catch {}
    })();
  }, [dispatch]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string } = {};
    if (!inviteCode && (!name || name.trim().length < 3)) newErrors.name = "At least 3 characters";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    setSubmitting(true);
    try {
      if (inviteCode.trim()) {
        // TODO: implement join via invite code when API is available
        toast.info("Joining via invite code is not yet implemented. Creating a workspace instead.");
      }
      const res = await createTenant({ name: name.trim() || "My workspace", plan, status });
      const body = (res as any)?.data || res;
      const t = body?.data || body;
      dispatch(addTenant({ id: t.id, name: t.name, plan: t.plan, status: t.status }));
      dispatch(setCurrentTenant(t.id));
      toast.success("Workspace created");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create/join workspace");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-xl items-center justify-center px-4">
      <Card className="w-full rounded-2xl border p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <UsersRound className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Create or join workspace</h1>
            <p className="text-sm text-muted-foreground">Create a new workspace or use an invite code.</p>
          </div>
        </div>

        <CardContent className="p-0">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Workspace name</Label>
              <Input id="name" placeholder="My workspace" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select value={plan} onValueChange={(v: any) => setPlan(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite">Invite code (optional)</Label>
              <Input id="invite" placeholder="XXXX-XXXX" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
              <p className="text-xs text-muted-foreground">If you have an invite, paste it here to join directly.</p>
            </div>

            <div className="pt-1">
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Processing..." : "Continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


