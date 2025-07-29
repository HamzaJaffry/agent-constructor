import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Eye, MessageSquare, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: "available" | "in-beta" | "coming-soon" | "draft";
  tags: string[];
  department?: string;
  apiEndpoint?: string;
  hasAccess?: boolean;
}

interface AgentCardProps {
  agent: Agent;
  onChatClick?: (agentId: string) => void;
  onEditClick?: (agentId: string) => void;
}

const statusConfig = {
  available: { label: "Available", variant: "success" as const },
  "in-beta": { label: "In Beta", variant: "warning" as const },
  "coming-soon": { label: "Coming Soon", variant: "secondary" as const },
  draft: { label: "Draft", variant: "outline" as const },
};

export default function AgentCard({ agent, onChatClick, onEditClick }: AgentCardProps) {
  const navigate = useNavigate();
  const config = statusConfig[agent.status];

  const handleViewDetails = () => {
    navigate(`/agent/${agent.id}`);
  };

  const handleChat = () => {
    if (onChatClick) {
      onChatClick(agent.id);
    } else {
      navigate(`/chat?agent=${agent.id}`);
    }
  };

  const handleEdit = () => {
    if (onEditClick) {
      onEditClick(agent.id);
    } else {
      navigate(`/create-agent?edit=${agent.id}`);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-border/50 hover:border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <Badge variant={config.variant} className="mb-2">
                {config.label}
              </Badge>
              <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {agent.name}
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {agent.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {agent.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {agent.department && (
          <p className="text-xs text-muted-foreground mb-4">
            All Departments • {agent.department}
          </p>
        )}
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewDetails}
            className="flex-1"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
          
          {agent.status === "available" && agent.hasAccess !== false && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleChat}
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </Button>
          )}
          
          {agent.status === "draft" && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleEdit}
              className="flex-1"
            >
              <Settings className="h-4 w-4" />
              Edit
            </Button>
          )}
          
          {agent.status === "in-beta" && (
            <Button 
              variant="warning" 
              size="sm" 
              onClick={handleChat}
              className="flex-1"
            >
              Join Beta
            </Button>
          )}
          
          {agent.status === "coming-soon" && (
            <Button 
              variant="secondary" 
              size="sm" 
              disabled
              className="flex-1"
            >
              Coming Soon
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}