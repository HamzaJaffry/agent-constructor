import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check, Zap, Key, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedCredentials {
  agentId: string;
  apiEndpoint: string;
  apiKey: string;
}

export default function DeveloperFlow() {
  const [agentName, setAgentName] = useState("");
  const [credentials, setCredentials] = useState<GeneratedCredentials | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const generateCredentials = () => {
    if (!agentName.trim()) {
      toast({
        title: "Agent name required",
        description: "Please enter a name for your agent.",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call to generate credentials
    const agentId = agentName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 6);
    const generatedCredentials: GeneratedCredentials = {
      agentId,
      apiEndpoint: `http://api.engro.com/agent/${agentId}/invoke`,
      apiKey: `sk-${Math.random().toString(36).substr(2, 32)}`,
    };

    setCredentials(generatedCredentials);
    toast({
      title: "Agent credentials generated!",
      description: "Your agent is ready for API integration.",
    });
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copied to clipboard",
        description: `${field} has been copied to your clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const CopyableField = ({ label, value, field, icon: Icon }: { 
    label: string; 
    value: string; 
    field: string; 
    icon: any;
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </Label>
      <div className="flex gap-2">
        <Input 
          value={value} 
          readOnly 
          className="font-mono text-sm bg-muted/50"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(value, field)}
          className="shrink-0"
        >
          {copiedField === field ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="agentName">Agent Name</Label>
          <Input
            id="agentName"
            placeholder="e.g., Customer Support Agent"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Button 
          onClick={generateCredentials}
          variant="hero"
          size="lg"
          disabled={!agentName.trim()}
        >
          <Zap className="h-4 w-4" />
          Generate Agent Credentials
        </Button>
      </div>

      {credentials && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              🎉 Your Agent is Ready!
            </h3>
            
            <div className="space-y-4">
              <CopyableField
                label="Agent ID"
                value={credentials.agentId}
                field="Agent ID"
                icon={Key}
              />
              
              <CopyableField
                label="API Endpoint"
                value={credentials.apiEndpoint}
                field="API Endpoint"
                icon={Globe}
              />
              
              <CopyableField
                label="API Key"
                value={credentials.apiKey}
                field="API Key"
                icon={Key}
              />
            </div>

            <div className="mt-6 p-4 bg-accent/30 rounded-lg">
              <h4 className="font-medium mb-2">Quick Start Guide:</h4>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Copy your API credentials above</li>
                <li>2. Use the API endpoint to send requests to your agent</li>
                <li>3. Include the API key in your request headers</li>
                <li>4. Start building amazing AI-powered applications!</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}