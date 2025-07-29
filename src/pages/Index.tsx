import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Bot, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AgentCard, { Agent } from "@/components/AgentCard";

// Mock data inspired by the uploaded image
const mockAgents: Agent[] = [
  {
    id: "email-summarizer",
    name: "Email Summarizer", 
    description: "Automatically summarize long email threads and extract key action items.",
    status: "available",
    tags: ["Productivity", "Communication"],
    department: "All Departments",
    hasAccess: true
  },
  {
    id: "data-analyzer",
    name: "Data Analyzer",
    description: "Transform raw data into actionable insights with automated reporting.",
    status: "available", 
    tags: ["Analytics", "Finance", "Operations"],
    department: "Finance, Operations, Marketing",
    hasAccess: true
  },
  {
    id: "meeting-minutes",
    name: "Meeting Minutes Bot",
    description: "Generate comprehensive meeting notes from audio recordings or transcripts.",
    status: "available",
    tags: ["Productivity", "HR", "Communication"],
    department: "All Departments", 
    hasAccess: true
  },
  {
    id: "customer-support",
    name: "Customer Support AI",
    description: "Intelligent chatbot for handling common customer inquiries and routing.",
    status: "in-beta",
    tags: ["Customer Service", "Support"],
    department: "Customer Service",
    hasAccess: false
  },
  {
    id: "code-reviewer",
    name: "Code Reviewer", 
    description: "Automated code review with security and best practice suggestions.",
    status: "available",
    tags: ["Development", "Security"],
    department: "Engineering",
    hasAccess: true
  },
  {
    id: "content-generator",
    name: "Content Generator",
    description: "Create marketing copy, blog posts, and social media content instantly.",
    status: "coming-soon",
    tags: ["Marketing", "Content"],
    department: "Marketing",
    hasAccess: false
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAgents, setFilteredAgents] = useState(mockAgents);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = mockAgents.filter(agent =>
      agent.name.toLowerCase().includes(query.toLowerCase()) ||
      agent.description.toLowerCase().includes(query.toLowerCase()) ||
      agent.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredAgents(filtered);
  };

  const handleChatClick = (agentId: string) => {
    navigate(`/chat?agent=${agentId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              AI Agent Catalog
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover powerful AI tools designed to enhance productivity across every department
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Create Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button 
            onClick={() => navigate("/create-agent")}
            variant="hero"
            size="lg"
            className="whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Create New Agent
          </Button>
        </div>

        {/* Featured Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                New to AI agents? Start by exploring our most popular tools or create your own custom agent in minutes.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/chat")}>
                  <Bot className="h-4 w-4" />
                  Try Chat Interface
                </Button>
                <Button variant="ghost" onClick={() => handleSearch("productivity")}>
                  View Productivity Tools
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onChatClick={handleChatClick}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No agents found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or create a new agent.
            </p>
            <Button onClick={() => setSearchQuery("")} variant="outline">
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
