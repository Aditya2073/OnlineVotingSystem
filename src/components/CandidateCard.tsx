
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface Candidate {
  id: string;
  name: string;
  party: string;
  age: number;
  education: string;
  experience: string;
  manifesto: string;
  image: string;
  partySymbol: string;
  votes?: number;
}

interface CandidateCardProps {
  candidate: Candidate;
  selected?: boolean;
  onSelect?: () => void;
  showVoteButton?: boolean;
  showStats?: boolean;
  totalVotes?: number;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  selected = false,
  onSelect,
  showVoteButton = false,
  showStats = false,
  totalVotes = 0,
}) => {
  const percentage = totalVotes > 0 && candidate.votes 
    ? Math.round((candidate.votes / totalVotes) * 100) 
    : 0;

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 h-full flex flex-col ${
        selected 
          ? 'ring-2 ring-indian-orange border-transparent' 
          : 'hover:shadow-md'
      }`}
    >
      <div className="relative pt-[56.25%] bg-gray-100">
        <img
          src={candidate.image}
          alt={candidate.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <Badge 
            variant="secondary" 
            className="bg-white/90 backdrop-blur-sm shadow-sm"
          >
            <img 
              src={candidate.partySymbol} 
              alt={candidate.party} 
              className="w-4 h-4 mr-1" 
            />
            {candidate.party}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{candidate.name}</CardTitle>
            <CardDescription className="text-sm">
              {candidate.age} years • {candidate.education}
            </CardDescription>
          </div>
          {showStats && candidate.votes !== undefined && (
            <div className="text-right">
              <div className="text-lg font-semibold">{percentage}%</div>
              <div className="text-xs text-gray-500">{candidate.votes} votes</div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="text-sm text-gray-600 flex-grow">
        <p className="line-clamp-3">{candidate.manifesto}</p>
        
        {showStats && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indian-blue h-2.5 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        {showVoteButton ? (
          <Button 
            className={`w-full ${
              selected 
                ? 'bg-indian-green hover:bg-indian-green/90' 
                : 'bg-indian-blue hover:bg-indian-blue/90'
            }`}
            onClick={onSelect}
          >
            {selected ? 'Selected' : 'Vote for Candidate'}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onSelect}
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
