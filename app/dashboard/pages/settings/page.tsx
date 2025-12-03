"use client";

import { useState, useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getProfile, updateProfile, uploadAvatar, deleteAvatar } from "@/services/userService";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCredentials } from "@/store/authSlice";
import { User, Mail, Phone, Globe, Upload, X, Loader2 } from "lucide-react";
import UserAvatar from "@/components/user-avatar";

export default function SettingsProfilePage() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth.user);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Try to get profile from API first
      try {
        const res = await getProfile();
        const data = res.data || res;
        const user = data?.user || data?.data || data;
        if (user) {
          setName(user.name || "");
          setEmail(user.email || "");
          setPhone(user.phone || "");
          setWebsite(user.website || "");
          setAvatarUrl(user.avatar_url || null);
        }
      } catch (apiError) {
        // Fallback to Redux store
        if (authUser) {
          setName(authUser.name || "");
          setEmail(authUser.email || "");
          setPhone(authUser.phone || "");
          setWebsite(authUser.website || "");
          setAvatarUrl(authUser.avatar_url || null);
        }
      }
    } catch (e: any) {
      console.error("Failed to load profile:", e);
      // Fallback to Redux store
      if (authUser) {
        setName(authUser.name || "");
        setEmail(authUser.email || "");
        setPhone(authUser.phone || "");
        setWebsite(authUser.website || "");
        setBio((authUser as any).bio || "");
        setAvatarUrl(authUser.avatar_url || null);
      }
    } finally {
      setLoading(false);
    }
  };

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await uploadAvatar(file);
      const data = res.data || res;
      const url = data?.avatar_url || data?.data?.avatar_url;
      if (url) {
        setAvatarUrl(url);
        if (authUser) {
          dispatch(setCredentials({ user: { ...authUser, avatar_url: url } } as any));
        }
        toast.success("Avatar updated successfully");
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDeleteAvatar = async () => {
    try {
      await deleteAvatar();
      setAvatarUrl(null);
      if (authUser) {
        dispatch(setCredentials({ user: { ...authUser, avatar_url: null } } as any));
      }
      toast.success("Avatar removed");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Delete failed");
    }
  };

  const onSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await updateProfile({ name, phone, website } as any);
      const data = res.data || res;
      const user = data?.user || data?.data || {};
      if (authUser) {
        dispatch(setCredentials({ 
          user: { 
            ...authUser, 
            name, 
            phone, 
            website
          } 
        } as any));
      }
      toast.success("Profile updated successfully");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div>
        <Separator />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site. You can update your information here.
        </p>
      </div>
      <Separator />
      
      <form onSubmit={(e) => { e.preventDefault(); onSaveProfile(); }} className="space-y-6">
        {/* Avatar Section */}
        <div className="space-y-4">
          <Label>Avatar</Label>
          <div className="flex items-center gap-6">
            <div className="relative">
              <UserAvatar
                image={avatarUrl || undefined}
                fallback={(name || email || "U").slice(0, 2).toUpperCase()}
                className="h-20 w-20 text-lg"
              />
              {avatarUrl && (
                <button
                  type="button"
                  onClick={onDeleteAvatar}
                  className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUpload(f);
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
              {avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onDeleteAvatar}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, PNG or GIF. Max size of 2MB.
          </p>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Full name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            This is your public display name. It can be your real name or a pseudonym.
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled
            className="h-11 bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Your email address cannot be changed here. Contact support if you need to update it.
          </p>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(+84) 0123 456 789"
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Your phone number (optional).
          </p>
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Website
          </Label>
          <Input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Your personal or company website (optional).
          </p>
        </div>


        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => loadProfile()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
