"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AdminUser,
    adminUpdateUser,
    adminResetPassword,
} from "@/services/userService";

interface UserEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: AdminUser | null;
    onSuccess: () => void;
}

export function UserEditDialog({ open, onOpenChange, user, onSuccess }: UserEditDialogProps) {
    const [editRole, setEditRole] = useState<string>("user");
    const [editActive, setEditActive] = useState<boolean>(true);
    const [editName, setEditName] = useState<string>("");
    const [editEmail, setEditEmail] = useState<string>("");
    const [showResetPwd, setShowResetPwd] = useState<boolean>(false);
    const [resetPwdValue, setResetPwdValue] = useState<string>("");

    // Sync state when user changes
    useEffect(() => {
        if (user) {
            setEditRole(user.role || "user");
            setEditActive(user.is_active !== false); // default to true if undefined
            setEditName(user.name || "");
            setEditEmail(user.email || "");
            setShowResetPwd(false);
            setResetPwdValue("");
        }
    }, [user, open]);

    const handleSaveEdit = async () => {
        if (!user) return;
        try {
            await adminUpdateUser(user.id, {
                role: editRole,
                is_active: editActive,
                name: editName.trim() || undefined,
                email: editEmail.trim() || undefined,
            });
            toast.success("User updated");
            onOpenChange(false);
            onSuccess();
        } catch (e: unknown) {
            const error = e as { response?: { data?: { message?: string } } };
            toast.error(error?.response?.data?.message || "Failed to update user");
        }
    };

    const handleToggleBan = async () => {
        if (!user) return;
        try {
            const newActive = !editActive;
            await adminUpdateUser(user.id, { is_active: newActive });
            setEditActive(newActive);
            toast.success(newActive ? "User unbanned" : "User banned");
            onSuccess();
        } catch (e: unknown) {
            const error = e as { response?: { data?: { message?: string } } };
            toast.error(error?.response?.data?.message || "Failed to update status");
        }
    };

    const handleResetPassword = async () => {
        if (!user) return;
        if (!showResetPwd) {
            setShowResetPwd(true);
            setResetPwdValue("");
            return;
        }
        try {
            await adminResetPassword(user.id, resetPwdValue || undefined);
            toast.success(
                resetPwdValue ? "Password reset" : "Temporary password generated",
            );
            setShowResetPwd(false);
            setResetPwdValue("");
        } catch (e: unknown) {
            const error = e as { response?: { data?: { message?: string } } };
            toast.error(error?.response?.data?.message || "Failed to reset password");
        }
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                            <SelectTrigger><SelectValue /></SelectTrigger>
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
                            <SelectTrigger><SelectValue /></SelectTrigger>
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
                        <Button variant="outline" onClick={handleToggleBan}>
                            {editActive ? 'Ban' : 'Unban'}
                        </Button>
                        <Button variant="outline" onClick={handleResetPassword}>Reset pwd</Button>
                    </div>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSaveEdit}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
