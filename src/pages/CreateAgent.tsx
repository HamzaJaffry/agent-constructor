import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeveloperFlow from "@/components/agent-creation/DeveloperFlow";
import BusinessFlow from "@/components/agent-creation/BusinessFlow";

export default function CreateAgent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("developer");

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
              Create Your AI Agent
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your preferred creation flow. Developers can get started quickly with API access, 
              while business users can configure agents through our intuitive interface.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="developer" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Developer Flow
              </TabsTrigger>
              <TabsTrigger value="business" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Business User Flow
              </TabsTrigger>
            </TabsList>

            <TabsContent value="developer">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Developer Flow
                  </CardTitle>
                  <CardDescription>
                    Quick setup for technical users. Generate your agent credentials instantly 
                    and start integrating with our API.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DeveloperFlow />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Business User Flow
                  </CardTitle>
                  <CardDescription>
                    Configure your agent through our user-friendly interface. 
                    Set up prompts, tools, and permissions without code.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BusinessFlow />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}