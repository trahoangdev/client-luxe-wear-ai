"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function SettingsPage() {
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [origins, setOrigins] = useState<string[]>([]);
  const [originInput, setOriginInput] = useState("");

  const [widgetTheme, setWidgetTheme] = useState<"light" | "dark">("light");
  const [widgetPosition, setWidgetPosition] = useState<"bottom-right" | "bottom-left">("bottom-right");

  const snippet = useMemo(() => {
    const code = `
<script>
  (function(){
    window.LuxeWearWidget = {
      theme: "${widgetTheme}",
      position: "${widgetPosition}",
      apiKey: "${apiKey || "YOUR_API_KEY"}",
    };
    var s = document.createElement('script');
    s.src = '${process.env.NEXT_PUBLIC_SERVER_URL || "https://server-luxe-wear-ai.onrender.com"}/public/widget.js';
    s.async = true; document.head.appendChild(s);
  })();
</script>`;
    return code.trim();
  }, [widgetTheme, widgetPosition, apiKey]);

  const addOrigin = () => {
    const v = originInput.trim();
    if (!v) return;
    try {
      const url = new URL(v);
      const normalized = `${url.protocol}//${url.host}`;
      if (origins.includes(normalized)) return toast.info("Origin already added");
      if (origins.length >= 10) return toast.error("Maximum 10 origins");
      setOrigins((prev) => [...prev, normalized]);
      setOriginInput("");
    } catch {
      toast.error("Invalid URL");
    }
  };

  const removeOrigin = (o: string) => setOrigins((prev) => prev.filter((x) => x !== o));

  const testCors = async (o: string) => {
    toast.info(`Testing CORS for ${o}...`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="security">
        <TabsList>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="embed">Embed Widget</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <section className="rounded-2xl border p-6">
            <div className="text-lg font-semibold mb-2">API Keys</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowKey((v) => !v)}>{showKey ? "Hide" : "Show"} API Key</Button>
              <Button onClick={() => { if (apiKey) { navigator.clipboard.writeText(apiKey); toast.success("Copied"); } }} disabled={!apiKey}>Copy</Button>
              <Button variant="outline" onClick={() => { setApiKey("ak_" + Math.random().toString(16).slice(2).padEnd(32, "0")); toast.success("Generated (demo)"); }}>Regenerate</Button>
            </div>
            {showKey && (
              <div className="mt-3 rounded-md border p-3 text-sm break-all bg-muted">{apiKey || "ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}</div>
            )}
          </section>

          <section className="rounded-2xl border p-6 space-y-3">
            <div className="text-lg font-semibold">Allowed Origins</div>
            <div className="flex gap-2">
              <Input placeholder="https://example.com" value={originInput} onChange={(e) => setOriginInput(e.target.value)} />
              <Button variant="outline" onClick={addOrigin}>Add</Button>
              <Button onClick={() => toast.success("Saved (demo)")}>Save</Button>
            </div>
            <div className="space-y-2">
              {origins.length === 0 && <div className="text-xs text-muted-foreground">No origins configured</div>}
              {origins.map((o) => (
                <div key={o} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <span>{o}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => testCors(o)}>Test CORS</Button>
                    <Button variant="ghost" size="sm" onClick={() => removeOrigin(o)}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="embed" className="space-y-6">
          <section className="rounded-2xl border p-6 space-y-4">
            <div className="text-lg font-semibold">Preview</div>
            <div className="rounded-lg border bg-muted/30 p-6 h-64 flex items-center justify-center text-sm text-muted-foreground">
              Widget preview ({widgetTheme}, {widgetPosition})
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-2">
                  <Button variant={widgetTheme === "light" ? "default" : "outline"} onClick={() => setWidgetTheme("light")}>Light</Button>
                  <Button variant={widgetTheme === "dark" ? "default" : "outline"} onClick={() => setWidgetTheme("dark")}>Dark</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <div className="flex gap-2">
                  <Button variant={widgetPosition === "bottom-right" ? "default" : "outline"} onClick={() => setWidgetPosition("bottom-right")}>Bottom-right</Button>
                  <Button variant={widgetPosition === "bottom-left" ? "default" : "outline"} onClick={() => setWidgetPosition("bottom-left")}>Bottom-left</Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Code snippet</Label>
              <Textarea rows={8} value={snippet} readOnly />
              <div className="flex justify-end">
                <Button onClick={() => { navigator.clipboard.writeText(snippet); toast.success("Copied"); }}>Copy snippet</Button>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
