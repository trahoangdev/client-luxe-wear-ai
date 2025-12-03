"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createAgent } from "@/services/agentService";
import { ChevronDown, Plus, Sparkles, MessageSquare, ShoppingCart, FileText, Headphones, Code, Zap, Shirt } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "At least 3 characters")
    .max(100, "Max 100 characters")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Only letters, numbers, spaces, -, and _"),
  description: z.string().max(500, "Max 500 characters").optional(),
  config: z
    .object({
      model: z.enum(["gemini-1.5-pro", "gemini-2.5-flash"]).default("gemini-1.5-pro"),
      temperature: z
        .number({ invalid_type_error: "Must be a number" })
        .min(0, "Min 0")
        .max(2, "Max 2")
        .optional(),
      maxTokens: z
        .number({ invalid_type_error: "Must be a number" })
        .int("Must be integer")
        .min(1, "Min 1")
        .max(4096, "Max 4096")
        .optional(),
      systemPrompt: z.string().max(2000, "Max 2000 characters").optional(),
      instructions: z.string().max(1000, "Max 1000 characters").optional(),
      tools: z.array(z.string()).optional(),
    })
    .optional(),
  allowed_origins: z.array(z.string().url("Invalid URL")).max(10, "Max 10 origins").optional(),
});

type AgentForm = z.infer<typeof schema>;

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  formData: Partial<AgentForm>;
}

const templates: AgentTemplate[] = [
  {
    id: "customer-support",
    name: "Customer Support",
    description: "Hỗ trợ khách hàng, trả lời câu hỏi thường gặp và giải quyết vấn đề",
    icon: Headphones,
    color: "bg-blue-500",
    formData: {
      name: "Customer Support Agent",
      description: "AI assistant for customer support and FAQ",
      config: {
        model: "gemini-1.5-pro",
        temperature: 0.7,
        maxTokens: 2048,
        systemPrompt: "You are a helpful and friendly customer support agent. Your goal is to assist customers with their questions and resolve their issues efficiently. Always be polite, professional, and empathetic.",
        instructions: "Provide clear and concise answers. If you don't know something, ask for more information or direct the customer to the appropriate resource.",
      },
    },
  },
  {
    id: "sales-assistant",
    name: "Sales Assistant",
    description: "Trợ lý bán hàng, tư vấn sản phẩm và hỗ trợ quy trình mua hàng",
    icon: ShoppingCart,
    color: "bg-green-500",
    formData: {
      name: "Sales Assistant",
      description: "AI assistant for sales and product recommendations",
      config: {
        model: "gemini-1.5-pro",
        temperature: 0.8,
        maxTokens: 2048,
        systemPrompt: "You are a knowledgeable sales assistant. Help customers find the right products, answer questions about features and pricing, and guide them through the purchase process.",
        instructions: "Be persuasive but not pushy. Focus on understanding customer needs and recommending the best solutions. Always highlight key benefits and value propositions.",
      },
    },
  },
  {
    id: "content-writer",
    name: "Content Writer",
    description: "Trợ lý viết nội dung, tạo bài viết và chỉnh sửa văn bản",
    icon: FileText,
    color: "bg-purple-500",
    formData: {
      name: "Content Writer",
      description: "AI assistant for content creation and writing",
      config: {
        model: "gemini-1.5-pro",
        temperature: 0.9,
        maxTokens: 3072,
        systemPrompt: "You are a professional content writer. Create engaging, well-structured content that is informative and easy to read. Adapt your writing style based on the target audience and purpose.",
        instructions: "Write clear, concise, and engaging content. Use proper grammar and formatting. Consider SEO best practices when appropriate.",
      },
    },
  },
  {
    id: "chatbot",
    name: "General Chatbot",
    description: "Chatbot đa mục đích cho trò chuyện và tương tác thông thường",
    icon: MessageSquare,
    color: "bg-pink-500",
    formData: {
      name: "Chatbot",
      description: "General-purpose conversational AI assistant",
      config: {
        model: "gemini-2.5-flash",
        temperature: 0.7,
        maxTokens: 2048,
        systemPrompt: "You are a friendly and helpful AI assistant. Engage in natural conversations, answer questions, and provide useful information. Be conversational and approachable.",
        instructions: "Keep responses natural and engaging. Adapt to the conversation flow and user's communication style.",
      },
    },
  },
  {
    id: "developer-assistant",
    name: "Developer Assistant",
    description: "Trợ lý lập trình, hỗ trợ code, debug và giải thích kỹ thuật",
    icon: Code,
    color: "bg-orange-500",
    formData: {
      name: "Developer Assistant",
      description: "AI assistant for coding and technical support",
      config: {
        model: "gemini-1.5-pro",
        temperature: 0.3,
        maxTokens: 3072,
        systemPrompt: "You are an expert software developer assistant. Help with coding, debugging, code reviews, and technical explanations. Provide accurate, well-structured code examples and explanations.",
        instructions: "Write clean, efficient code. Explain your reasoning clearly. Follow best practices and coding standards. Include comments when helpful.",
      },
    },
  },
  {
    id: "fashion-assistant",
    name: "Fashion Assistant",
    description: "Tư vấn thời trang, phong cách và xu hướng, đề xuất outfit phù hợp",
    icon: Shirt,
    color: "bg-indigo-500",
    formData: {
      name: "Fashion Assistant",
      description: "AI assistant for fashion advice, style recommendations, and trend insights",
      config: {
        model: "gemini-1.5-pro",
        temperature: 0.8,
        maxTokens: 2048,
        systemPrompt: "You are a knowledgeable fashion consultant and style expert. Help customers with fashion advice, outfit recommendations, style tips, and trend insights. Understand different body types, occasions, and personal preferences to provide tailored fashion guidance.",
        instructions: "Provide personalized fashion recommendations based on the customer's needs, body type, occasion, and style preferences. Be creative and inspiring while staying practical. Suggest color combinations, accessories, and styling tips. Stay updated with current fashion trends and explain why certain styles work well together.",
      },
    },
  },
  {
    id: "custom",
    name: "Start from Scratch",
    description: "Tạo agent tùy chỉnh từ đầu với cấu hình của riêng bạn",
    icon: Zap,
    color: "bg-gray-500",
    formData: {
      name: "",
      description: "",
      config: {
        model: "gemini-1.5-pro",
        temperature: 0.7,
        maxTokens: 2048,
        systemPrompt: "",
        instructions: "",
      },
    },
  },
];

export default function CreateAgentPage() {
  const router = useRouter();
  const [configOpen, setConfigOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<AgentForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      config: { model: "gemini-1.5-pro", temperature: 0.7, maxTokens: 2048 },
      allowed_origins: [],
    },
    mode: "onChange",
  });

  const config = watch("config");

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setValue("name", template.formData.name || "");
      setValue("description", template.formData.description || "");
      if (template.formData.config) {
        setValue("config.model", template.formData.config.model || "gemini-1.5-pro");
        setValue("config.temperature", template.formData.config.temperature || 0.7);
        setValue("config.maxTokens", template.formData.config.maxTokens || 2048);
        setValue("config.systemPrompt", template.formData.config.systemPrompt || "");
        setValue("config.instructions", template.formData.config.instructions || "");
      }
      setShowForm(true);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      const res = await createAgent(data);
      if (res.success) {
        toast.success("Agent created successfully");
        const agentId = res.data?.id || (res as any).data?.data?.id || (res as any).id;
        if (agentId) {
          router.push(`/dashboard/chat?agentId=${agentId}`);
        } else {
          router.push(`/dashboard`);
        }
      } else {
        toast.error(res.message || "Failed to create agent");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to create agent");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create AI Agent</h1>
        <p className="text-muted-foreground">Choose a template or start from scratch to configure a new AI agent</p>
      </div>

      {!showForm ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Choose a Template</h2>
            <p className="text-sm text-muted-foreground mb-4">Select a template to get started quickly, or create a custom agent from scratch</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${
                    selectedTemplate === template.id ? "border-primary border-2" : ""
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${template.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                    <CardDescription className="text-sm mt-2">{template.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
          {selectedTemplate && (
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Cancel
              </Button>
              <Button onClick={() => setShowForm(true)}>
                Continue with Template
              </Button>
            </div>
          )}
        </div>
      ) : (
        <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 3, message: "At least 3 characters" },
              maxLength: { value: 100, message: "Max 100 characters" },
              pattern: { value: /^[a-zA-Z0-9\s\-_]+$/, message: "Only letters, numbers, spaces, -, and _" },
            })}
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description", {
              maxLength: { value: 500, message: "Max 500 characters" },
            })}
            rows={3}
          />
          {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
        </div>

        <Collapsible open={configOpen} onOpenChange={setConfigOpen}>
          <CollapsibleTrigger asChild>
            <Button type="button" variant="ghost" className="flex items-center justify-between w-full">
              Advanced Configuration
              <ChevronDown className={`h-4 w-4 transition-transform ${configOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select
                value={config?.model}
                onValueChange={(v) => setValue("config.model", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-1.5-pro">gemini-1.5-pro</SelectItem>
                  <SelectItem value="gemini-2.5-flash">gemini-2.5-flash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (0-2)</Label>
              <Input
                id="temperature"
                type="number"
                min={0}
                max={2}
                step={0.1}
                value={config?.temperature || 0.7}
                onChange={(e) => setValue("config.temperature", parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens (1-4096)</Label>
              <Input
                id="maxTokens"
                type="number"
                min={1}
                max={4096}
                value={config?.maxTokens || 2048}
                onChange={(e) => setValue("config.maxTokens", parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
          <Textarea id="systemPrompt" {...register("config.systemPrompt")} rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
          <Textarea id="instructions" {...register("config.instructions")} rows={3} />
            </div>
          </CollapsibleContent>
        </Collapsible>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={submitting}>
              Back to Templates
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? "Creating..." : "Create Agent"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}



