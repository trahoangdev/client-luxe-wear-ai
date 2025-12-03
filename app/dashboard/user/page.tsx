"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getProfile, updateProfile, uploadAvatar, deleteAvatar } from "@/services/userService";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/authSlice";
import { useAppSelector } from "@/store";

export default function UserAccountPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [confirmDeleteChats, setConfirmDeleteChats] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

  const dispatch = useAppDispatch();

  const onUpload = async (file: File) => {
    try {
      const res = await uploadAvatar(file);
      const data = res.data || res;
      const url = data?.avatar_url || data?.data?.avatar_url;
      if (url) {
        setAvatarUrl(url);
        if (authUser) dispatch(setCredentials({ user: { ...authUser, avatar_url: url } } as any));
        toast.success("Avatar updated");
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Upload failed");
    }
  };

  const onSaveProfile = async () => {
    try {
      const res = await updateProfile({ name, phone, website });
      const data = res.data || res;
      const user = data?.user || data?.data || {};
      if (authUser) {
        dispatch(setCredentials({ user: { ...authUser, name, phone, website } } as any));
      }
      toast.success("Profile saved");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Save failed");
    }
  };

  const authUser = useAppSelector((s) => s.auth.user);
  useEffect(() => {
    if (authUser) {
      setName(authUser.name || "");
      setEmail(authUser.email || "");
      setPhone(authUser.phone || "");
      setWebsite(authUser.website || "");
      setAvatarUrl(authUser.avatar_url || null);
    }
  }, [authUser]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">User Profile</h1>

      {/* Profile */}
      <section className="rounded-2xl border bg-background p-6 space-y-4">
        <div className="text-lg font-semibold">Profile</div>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full border bg-muted">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No avatar</div>
            )}
          </div>
          <div className="flex gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>Upload</Button>
            <Button variant="ghost" onClick={async () => { try { await deleteAvatar(); setAvatarUrl(null); if (authUser) dispatch(setCredentials({ user: { ...authUser, avatar_url: null } } as any)); toast.success("Avatar removed"); } catch (e: any) { toast.error(e?.response?.data?.message || e?.message || "Delete failed"); } }}>Delete</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(+84) 0123 456 789" />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSaveProfile}>Save</Button>
        </div>
      </section>

      {/* Danger Zone */}
      <div className="relative">
        <div className="absolute left-0 right-0 top-0 flex items-center justify-center text-[11px] uppercase tracking-widest text-red-600">
          Danger Zone
        </div>
      </div>

      <section className="rounded-2xl border bg-background p-6 space-y-4">
        <div className="text-lg font-semibold">Danger Zone</div>
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <div className="text-sm font-medium">Delete all conversations</div>
            <div className="text-xs text-muted-foreground">This cannot be undone</div>
          </div>
          <Button variant="destructive" onClick={() => setConfirmDeleteChats(true)}>Delete</Button>
        </div>
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <div className="text-sm font-medium">Delete account</div>
            <div className="text-xs text-muted-foreground">Permanently remove your account and all data</div>
          </div>
          <Button variant="destructive" onClick={() => setConfirmDeleteAccount(true)}>Delete Account</Button>
        </div>
      </section>

      <Dialog open={confirmDeleteChats} onOpenChange={setConfirmDeleteChats}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete all conversations</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete all your conversations? This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteChats(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setConfirmDeleteChats(false); toast.success("Conversations deleted (demo)"); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDeleteAccount} onOpenChange={setConfirmDeleteAccount}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action will permanently delete your account and all data. Continue?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteAccount(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setConfirmDeleteAccount(false); toast.success("Account deleted (demo)"); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
