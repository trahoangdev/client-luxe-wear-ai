"use client";

import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface AgentCardProps {
  agent: any;
  onOpenDetail: () => void;
  onChat: () => void;
  onDuplicate: () => Promise<void> | void;
  onDelete: () => void;
}

function AgentCardComponent({
  agent,
  onOpenDetail,
  onChat,
  onDuplicate,
  onDelete,
}: AgentCardProps) {
  return (
    <div className="rounded-2xl border overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-foreground/20">
      <div
        className="h-56 bg-gradient-to-r cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
        style={{
          background: `linear-gradient(135deg, ${agent.gradient_color || "#4F46E5"} 0%, ${
            agent.gradient_color_end || "#7C3AED"
          } 100%)`,
        }}
        onClick={onOpenDetail}
      />
      <div className="flex items-center justify-between p-4 bg-background">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base mb-1 truncate">{agent.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
            {agent.description || "Không có mô tả"}
          </p>
          <p className="text-xs text-muted-foreground">
            {(() => {
              const raw = agent.createdAt || agent.created_at;
              const d = raw ? new Date(raw) : null;
              const valid = d && !isNaN(d.getTime());
              return `Đã tạo ${valid ? d!.toLocaleString("vi-VN") : "N/A"}`;
            })()}
          </p>
        </div>
        <div className="flex gap-2 ml-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation();
              onChat();
            }}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onOpenDetail}>Chỉnh sửa</DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>Sao chép</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export const AgentCard = memo(AgentCardComponent);


