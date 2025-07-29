import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, Settings, Wrench, Users, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AgentConfig {
  agent_id: string;
  system_prompt: string;
  temperature: number;
  models: string[];
  tools: string[];
  user_tool_overrides: Record<string, string[]>;
  usage_limits: {
    max_requests_per_day: number;
  };
  rag_settings: {
    enabled: boolean;
    threshold: number;
  };
}

const availableTools = [
  "search", "calculator", "code_interpreter", "image_analyzer", 
  "file_processor", "web_scraper", "email_sender"
];

export default function BusinessFlow() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [config, setConfig] = useState<AgentConfig>({
    agent_id: "",
    system_prompt: "You are a helpful AI assistant that specializes in answering questions about technology.",
    temperature: 0.7,
    models: ["anthropic.claude-v2:1"],
    tools: ["search", "calculator"],
    user_tool_overrides: {
      admin: ["search", "calculator", "code_interpreter"],
      basic_user: ["search", "calculator"]
    },
    usage_limits: {
      max_requests_per_day: 100
    },
    rag_settings: {
      enabled: false,
      threshold: 200
    }
  });

  const updateConfig = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedConfig = (parent: string, field: string, value: any) => {
    setConfig(prev => {
      const parentObj = prev[parent as keyof AgentConfig] as Record<string, any>;
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [field]: value
        }
      };
    });
  };

  const toggleTool = (tool: string) => {
    setConfig(prev => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter(t => t !== tool)
        : [...prev.tools, tool]
    }));
  };

  const saveAgent = async () => {
    if (!config.agent_id.trim()) {
      toast({
        title: "Agent ID required",
        description: "Please enter an agent ID.",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Agent saved successfully!",
      description: "Your agent has been configured and is ready to use.",
    });

    // Navigate back to catalog or to chat
    navigate("/");
  };

  return (
    <div className="space-y-6">
      {/* Basic Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Basic Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agent_id">Agent ID</Label>
            <Input
              id="agent_id"
              placeholder="tech-support"
              value={config.agent_id}
              onChange={(e) => updateConfig("agent_id", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="system_prompt">System Prompt</Label>
            <Textarea
              id="system_prompt"
              rows={4}
              placeholder="You are a helpful AI assistant..."
              value={config.system_prompt}
              onChange={(e) => updateConfig("system_prompt", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Temperature: {config.temperature}</Label>
            <Slider
              value={[config.temperature]}
              onValueChange={(value) => updateConfig("temperature", value[0])}
              min={0}
              max={1}
              step={0.1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>More focused</span>
              <span>More creative</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Models</Label>
            <div className="flex gap-2">
              {config.models.map((model) => (
                <Badge key={model} variant="secondary">
                  {model}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Models are managed by system administrators and cannot be modified.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tools Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Tools & Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Available Tools</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableTools.map((tool) => (
                <div
                  key={tool}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    config.tools.includes(tool)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-primary/30"
                  }`}
                  onClick={() => toggleTool(tool)}
                >
                  <div className="text-sm font-medium capitalize">
                    {tool.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            User Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Admin Tools</Label>
              <div className="flex flex-wrap gap-2">
                {config.user_tool_overrides.admin.map((tool) => (
                  <Badge key={tool} variant="default">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Basic User Tools</Label>
              <div className="flex flex-wrap gap-2">
                {config.user_tool_overrides.basic_user.map((tool) => (
                  <Badge key={tool} variant="secondary">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage & RAG Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Usage Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max_requests">Max Requests per Day</Label>
              <Input
                id="max_requests"
                type="number"
                value={config.usage_limits.max_requests_per_day}
                onChange={(e) => updateNestedConfig("usage_limits", "max_requests_per_day", parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RAG Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="rag-enabled"
                checked={config.rag_settings.enabled}
                onCheckedChange={(checked) => updateNestedConfig("rag_settings", "enabled", checked)}
              />
              <Label htmlFor="rag-enabled">Enable RAG</Label>
            </div>

            {config.rag_settings.enabled && (
              <div className="space-y-2">
                <Label htmlFor="rag-threshold">Similarity Threshold</Label>
                <Input
                  id="rag-threshold"
                  type="number"
                  value={config.rag_settings.threshold}
                  onChange={(e) => updateNestedConfig("rag_settings", "threshold", parseInt(e.target.value))}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <Button 
          onClick={saveAgent}
          variant="hero"
          size="lg"
        >
          <Save className="h-4 w-4" />
          Save & Publish Agent
        </Button>
      </div>
    </div>
  );
}