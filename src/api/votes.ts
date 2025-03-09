import Vote from '@/models/Vote';
import User from '@/models/User';
import Candidate from '@/models/Candidate';
import connectToDatabase from '@/lib/mongodb';
import { clientVoteForCandidate, clientGetElectionResults, clientGetRegionalData } from './clientApi';

// Submit a vote
export const submitVote = async (userId: string, candidateId: string) => {
  // If in browser, use client-side API
  if (typeof window !== 'undefined') {
    return clientVoteForCandidate(candidateId, userId);
  }
  
  // Server-side code
  await connectToDatabase();
  
  // Check if user has already voted
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.hasVoted) {
    throw new Error('You have already cast your vote');
  }
  
  // Check if candidate exists
  const candidate = await Candidate.findById(candidateId);
  
  if (!candidate) {
    throw new Error('Candidate not found');
  }
  
  // Create new vote
  const vote = new Vote({
    user: userId,
    candidate: candidateId,
    timestamp: new Date()
  });
  
  await vote.save();
  
  // Update user's voting status
  user.hasVoted = true;
  await user.save();
  
  // Update candidate's vote count
  candidate.votes = (candidate.votes || 0) + 1;
  await candidate.save();
  
  return {
    success: true,
    message: 'Vote cast successfully',
    candidate
  };
};

// Get election results
export const getElectionResults = async () => {
  // If in browser, use client-side API
  if (typeof window !== 'undefined') {
    return clientGetElectionResults();
  }
  
  // Server-side code
  await connectToDatabase();
  
  // Get all candidates with their vote counts
  const candidates = await Candidate.find({}).sort({ votes: -1 });
  
  // Calculate total votes
  const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
  
  // Get total registered voters
  const totalVoters = await User.countDocuments({ isAdmin: false });
  
  // Calculate turnout percentage
  const turnoutPercentage = totalVoters > 0 ? (totalVotes / totalVoters) * 100 : 0;
  
  // Calculate percentages for each candidate
  const candidatesWithPercentage = candidates.map(candidate => {
    const votes = candidate.votes || 0;
    const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
    
    return {
      id: candidate._id,
      name: candidate.name,
      party: candidate.party,
      votes: votes,
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
      winner: false // Will be updated below
    };
  });
  
  // Determine winner (if any votes cast)
  let winningCandidate = null;
  let winningParty = null;
  
  if (totalVotes > 0 && candidatesWithPercentage.length > 0) {
    // Mark the candidate with most votes as winner
    candidatesWithPercentage[0].winner = true;
    winningCandidate = candidatesWithPercentage[0].name;
    winningParty = candidatesWithPercentage[0].party;
  }
  
  return {
    candidates: candidatesWithPercentage,
    totalVotes,
    turnoutPercentage: Math.round(turnoutPercentage * 10) / 10,
    winningCandidate,
    winningParty
  };
};

// Get regional voting data
export const getRegionalData = async () => {
  // If in browser, use client-side API
  if (typeof window !== 'undefined') {
    return clientGetRegionalData();
  }
  
  // Server-side code
  await connectToDatabase();
  
  // In a real app, we would query the database for regional data
  // For now, return mock data
  return [
    { region: "North", turnout: 68, winner: "Aditya Sharma" },
    { region: "South", turnout: 72, winner: "Priya Patel" },
    { region: "East", turnout: 65, winner: "Rajesh Kumar" },
    { region: "West", turnout: 70, winner: "Aditya Sharma" },
    { region: "Central", turnout: 75, winner: "Aditya Sharma" },
  ];
};
