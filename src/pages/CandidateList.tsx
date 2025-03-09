import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getCandidates } from "@/api/candidates";
import { Candidate } from "@/config/candidates";
import { Skeleton } from "@/components/ui/skeleton";

const CandidateList = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setIsLoading(true);
        const data = await getCandidates();
        setCandidates(data);
      } catch (error) {
        console.error("Failed to load candidates:", error);
        toast.error("Failed to load candidates");
      } finally {
        setIsLoading(false);
      }
    };

    loadCandidates();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Meet the Candidates</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Loading candidate information...
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 bg-muted p-6 flex flex-col items-center justify-center">
                  <Skeleton className="w-40 h-40 rounded-full" />
                  <Skeleton className="h-6 w-32 mt-4" />
                  <Skeleton className="h-4 w-20 mt-2" />
                </div>
                <div className="w-full md:w-3/4 p-6">
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Meet the Candidates</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Learn about each candidate's background, experience, and proposed policies before casting your vote.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/4 bg-muted p-6 flex flex-col items-center justify-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-secondary">
                  <img
                    src={candidate.imageUrl || candidate.photo || "/placeholder.svg"}
                    alt={candidate.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-center">{candidate.name}</h3>
                <Badge className="mt-2 bg-indian-orange">{candidate.party}</Badge>
              </div>

              <div className="w-full md:w-3/4 p-6">
                <Tabs defaultValue="background">
                  <TabsList className="mb-4">
                    <TabsTrigger value="background">Background</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="manifesto">Manifesto</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="background" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Age</h4>
                        <p>{candidate.age || "Not specified"} years</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Education</h4>
                        <p>{candidate.education || "Not specified"}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="experience">
                    <p>{candidate.experience || candidate.bio || "No experience information available."}</p>
                  </TabsContent>
                  
                  <TabsContent value="manifesto">
                    <p>{candidate.manifesto || "No manifesto information available."}</p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
