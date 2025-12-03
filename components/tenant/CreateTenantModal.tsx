import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createTenant } from '@/services/tenantService';
import { useAppDispatch } from '@/store';
import { addTenant, setCurrentTenant } from '@/store/tenantSlice';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateTenantModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [plan, setPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      return toast.error('Tenant name is required');
    }

    setLoading(true);
    try {
      const res = await createTenant({ name, plan });
      const body = (res as any)?.data || res; // axios wraps response in .data
      const t = body?.data || body; // API format { success, data }
      if (!t?.id) {
        throw new Error('Invalid response');
      }

      dispatch(addTenant({ id: t.id, name: t.name, plan: t.plan, status: t.status }));
      dispatch(setCurrentTenant(t.id));

      toast.success('Tenant created successfully');
      onClose();
      setName('');
      setPlan('free');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Tenant</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Tenant Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Company" />
          </div>
          <div>
            <Label htmlFor="plan">Plan</Label>
            <Select value={plan} onValueChange={(v: any) => setPlan(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
