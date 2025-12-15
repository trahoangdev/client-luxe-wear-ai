import { MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const getPrompts = (agentName: string = ""): string[] => {
  const name = agentName.toLowerCase();

  if (name.includes("fashion") || name.includes("thời trang") || name.includes("style")) {
    return [
      "Xu hướng thời trang mùa hè năm nay",
      "Gợi ý phối đồ cho buổi phỏng vấn",
      "Cách bảo quản áo lụa",
      "Phân biệt các loại vải cotton"
    ];
  }

  if (name.includes("travel") || name.includes("du lịch")) {
    return [
      "Lên lịch trình đi Đà Nẵng 3 ngày 2 đêm",
      "Những địa điểm ăn uống ngon ở Hà Nội",
      "Kinh nghiệm du lịch Nhật Bản tự túc",
      "Checklist đồ cần mang khi đi biển"
    ];
  }

  if (name.includes("code") || name.includes("dev") || name.includes("tech")) {
    return [
      "Giải thích về Microservices",
      "Viết hàm sort trong JavaScript",
      "Cách tối ưu performance React app",
      "So sánh REST API và GraphQL"
    ];
  }

  // Default prompts
  return [
    "Giải thích về điện toán lượng tử",
    "Viết một email chuyên nghiệp",
    "Tóm tắt bài báo này",
    "Giúp tôi lên kế hoạch làm việc"
  ];
};

export function EmptyState({ onPromptClick, agentName }: { onPromptClick?: (text: string) => void; agentName?: string }) {
  const prompts = getPrompts(agentName);

  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 p-8">
      <div className="space-y-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center mx-auto border shadow-sm mb-4">
          <MessageSquare className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Bắt đầu cuộc trò chuyện {agentName ? `với ${agentName}` : ""}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Gửi tin nhắn để bắt đầu hoặc chọn một trong các gợi ý bên dưới.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {prompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onPromptClick?.(prompt)}
            className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all text-left group"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">
              {prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

