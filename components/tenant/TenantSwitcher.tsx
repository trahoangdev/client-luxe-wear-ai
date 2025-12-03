'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setCurrentTenant, setTenants } from '@/store/tenantSlice';
import { listUserTenants } from '@/services/tenantService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Loader2, Plus, Search } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';

export default function TenantSwitcher() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tenants, currentTenant } = useAppSelector((state) => state.tenant);
  const safeTenants = Array.isArray(tenants) ? tenants : [];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (safeTenants.length === 0) {
          setLoading(true);
          const res = await listUserTenants();
          const body = (res as any)?.data || res;
          const data = body?.data?.tenants || body?.tenants || [];
          if (Array.isArray(data)) {
            dispatch(setTenants(data));
            if (!currentTenant && data.length > 0) {
              const saved = typeof window !== 'undefined' ? localStorage.getItem('currentTenant') : null;
              dispatch(setCurrentTenant(saved || data[0].id));
            }
          }
        }
      } catch (e) {
        // ignore silently in header
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return safeTenants;
    return safeTenants.filter((t) => t.name.toLowerCase().includes(q));
  }, [query, safeTenants]);

  const current = safeTenants.find((t) => t.id === currentTenant);

  const onSelect = (id: string) => {
    dispatch(setCurrentTenant(id));
    toast.success('Switched workspace');
    setOpen(false);
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" className="h-8 px-3">
          {current?.name || 'Select workspace'}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" sideOffset={8} className="w-72 rounded-xl border bg-background p-2 shadow-md">
        <div className="flex items-center gap-2 rounded-lg border px-2 py-1.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search workspace..." className="h-7 border-none p-0 shadow-none focus-visible:ring-0" />
        </div>
        <div className="my-2 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">No workspaces</div>
          ) : (
            filtered.map((t) => (
              <button key={t.id} onClick={() => onSelect(t.id)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-muted">
                <span>{t.name}</span>
                {currentTenant === t.id && <Check className="h-4 w-4" />}
              </button>
            ))
          )}
        </div>
        <div className="mt-1">
          <button onClick={() => { setOpen(false); router.push('/dashboard/join'); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted">
            <Plus className="h-4 w-4" />
            Create or join workspace
          </button>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
