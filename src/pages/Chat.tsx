import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Bot, User, RefreshCw } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  status: "available" | "in-beta" | "coming-soon" | "draft";
}

// Mock data
const availableAgents: Agent[] = [
  {
    id: "email-summarizer",
    name: "Email Summarizer",
    description: "Automatically summarize long email threads and extract key action items.",
    status: "available"
  },
  {
    id: "data-analyzer", 
    name: "Data Analyzer",
    description: "Transform raw data into actionable insights with automated reporting.",
    status: "available"
  },
  {
    id: "customer-support",
    name: "Customer Support AI",
    description: "Intelligent chatbot for handling common customer inquiries and routing.",
    status: "in-beta"
  }
];

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedAgent = searchParams.get("agent");
  
  const [selectedAgent, setSelectedAgent] = useState<string>(preselectedAgent || "");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentAgent = availableAgents.find(agent => agent.id === selectedAgent);

  useEffect(() => {
    if (selectedAgent && messages.length === 0) {
      // Add welcome message when agent is selected
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Hello! I'm ${currentAgent?.name}. ${currentAgent?.description} How can I help you today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedAgent, currentAgent]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user", 
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you're asking about "${userMessage.content}". As ${currentAgent?.name}, I'm processing your request and here's my response. This is a simulated response for demonstration purposes.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([]);
    if (currentAgent) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Hello! I'm ${currentAgent.name}. ${currentAgent.description} How can I help you today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              AI Agent Chat
            </h1>
            <p className="text-xl text-muted-foreground">
              Select an agent and start a conversation
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Agent Selection Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Select Agent</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an agent..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAgents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {currentAgent && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <span className="font-medium">{currentAgent.name}</span>
                      </div>
                      <Badge variant={currentAgent.status === "available" ? "success" : "warning"}>
                        {currentAgent.status === "available" ? "Available" : "In Beta"}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {currentAgent.description}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearChat}
                        className="w-full"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Clear Chat
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    {currentAgent ? `Chat with ${currentAgent.name}` : "Select an agent to start chatting"}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Bot className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>

                          {message.role === "user" && (
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                              <User className="h-4 w-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex gap-3 justify-start">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder={selectedAgent ? "Type your message..." : "Select an agent first..."}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        disabled={!selectedAgent || isLoading}
                        className="flex-1"
                      />
                      <Button 
                        onClick={sendMessage}
                        disabled={!selectedAgent || !inputMessage.trim() || isLoading}
                        size="icon"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}