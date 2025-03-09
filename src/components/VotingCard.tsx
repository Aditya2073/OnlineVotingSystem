
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Candidate } from './CandidateCard';

interface VotingCardProps {
  candidates: Candidate[];
  selectedCandidate: string | null;
  onSelectCandidate: (id: string) => void;
}

const VotingCard: React.FC<VotingCardProps> = ({
  candidates,
  selectedCandidate,
  onSelectCandidate,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cast Your Vote</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedCandidate || ""}
          onValueChange={onSelectCandidate}
          className="space-y-3"
        >
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`flex items-center space-x-4 rounded-lg border p-4 transition-all ${
                selectedCandidate === candidate.id
                  ? "border-indian-blue bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <RadioGroupItem value={candidate.id} id={candidate.id} />
              <div className="flex flex-1 items-center space-x-3">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={candidate.image}
                    alt={candidate.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor={candidate.id}
                    className="text-base font-medium cursor-pointer"
                  >
                    {candidate.name}
                  </Label>
                  <p className="text-sm text-gray-500 flex items-center">
                    <img
                      src={candidate.partySymbol}
                      alt={candidate.party}
                      className="w-4 h-4 mr-1"
                    />
                    {candidate.party}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default VotingCard;
