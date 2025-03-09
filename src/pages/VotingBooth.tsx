import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getCandidates, voteForCandidate } from "@/api/candidates";
import { useAuth } from "@/context/AuthContext";
import { Candidate } from "@/config/candidates";

const VotingBooth = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      toast.error("You must be logged in to vote");
      navigate("/login");
      return;
    }

    // Redirect if already voted
    if (user.hasVoted) {
      toast.info("You have already cast your vote");
      navigate("/results");
      return;
    }

    // Load candidates
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
  }, [user, navigate]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate before submitting your vote");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to vote");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = user.id;
      
      if (!userId) {
        throw new Error("User ID not found");
      }
      
      await voteForCandidate(selectedCandidate, userId);
      
      // Update the user's hasVoted status in the auth context
      updateUser({
        ...user,
        hasVoted: true
      });
      
      toast.success("Vote Submitted Successfully!");
      navigate("/results");
    } catch (error: any) {
      console.error("Voting error:", error);
      toast.error(error.message || "Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Loading Candidates...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Voting Booth</h1>
        <p className="text-muted-foreground">
          Select your preferred candidate and submit your vote. You can only vote once.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {candidates.map((candidate) => (
          <Card
            key={candidate.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedCandidate === candidate.id
                ? "ring-2 ring-indian-orange shadow-lg"
                : "hover:shadow-md"
            }`}
            onClick={() => setSelectedCandidate(candidate.id)}
          >
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-muted">
                <img
                  src={candidate.imageUrl}
                  alt={candidate.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">{candidate.name}</h3>
              <p className="text-sm text-muted-foreground">{candidate.party}</p>
              
              <Button 
                variant="outline"
                className={`mt-4 ${
                  selectedCandidate === candidate.id
                    ? "bg-indian-orange text-white hover:bg-indian-orange/90"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCandidate(candidate.id);
                }}
              >
                {selectedCandidate === candidate.id ? "Selected" : "Select"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={handleVote}
          disabled={!selectedCandidate || isSubmitting}
          className="bg-indian-blue hover:bg-indian-blue/90"
        >
          {isSubmitting ? "Submitting..." : "Submit Vote"}
        </Button>
      </div>
    </div>
  );
};

export default VotingBooth;
