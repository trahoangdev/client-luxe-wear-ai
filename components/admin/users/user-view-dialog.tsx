"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AdminUser } from "@/services/userService";

interface UserViewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: AdminUser | null;
}

export function UserViewDialog({ open, onOpenChange, user }: UserViewDialogProps) {
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>User details</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {user.name || "-"}</div>
                    <div><span className="font-medium">Email:</span> {user.email}</div>
                    <div><span className="font-medium">Role:</span> {user.role || "user"}</div>
                    <div><span className="font-medium">Status:</span> {user.is_active === false ? "banned" : "active"}</div>
                    <div><span className="font-medium">Email verified:</span> {String(!!user.email_verified)}</div>
                    <div><span className="font-medium">Phone:</span> {user.phone || "-"}</div>
                    <div><span className="font-medium">Website:</span> {user.website || "-"}</div>
                    <div><span className="font-medium">Last login:</span> {user.last_login ? new Date(user.last_login).toLocaleString() : "-"}</div>
                    <div><span className="font-medium">Created:</span> {user.created_at ? new Date(user.created_at).toLocaleString() : "-"}</div>
                    <div><span className="font-medium">ID:</span> <span className="break-all inline-block max-w-[260px] align-middle">{user.id}</span></div>
                    <div><span className="font-medium">Avatar:</span> <span className="break-all inline-block max-w-[260px] align-middle">{user.avatar_url || "-"}</span></div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
