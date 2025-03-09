// Client-side API functions that use localStorage for authentication and data
// This avoids MongoDB connection issues in the browser

import { getDefaultCandidates, Candidate } from '@/config/candidates';

// Mock user data for development
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    voterId: 'ADMIN123',
    isAdmin: true,
    hasVoted: false
  },
  {
    id: '2',
    name: 'Test User',
    email: 'user@example.com',
    voterId: 'VOTER123',
    isAdmin: false,
    hasVoted: false
  }
];

// Get candidates from central configuration
let MOCK_CANDIDATES: Candidate[] = getDefaultCandidates();

// Initialize candidates from localStorage if available
const initCandidatesFromStorage = () => {
  if (typeof window !== 'undefined') {
    const storedCandidates = localStorage.getItem('candidates');
    if (storedCandidates) {
      try {
        MOCK_CANDIDATES = JSON.parse(storedCandidates);
      } catch (e) {
        console.error('Failed to parse stored candidates:', e);
        // Fall back to default candidates
        MOCK_CANDIDATES = getDefaultCandidates();
      }
    } else {
      // Store default candidates in localStorage
      localStorage.setItem('candidates', JSON.stringify(MOCK_CANDIDATES));
    }
  }
};

// Initialize candidates when this file is imported
initCandidatesFromStorage();

// Client-side login function
export const clientLoginUser = async (email: string, password: string) => {
  // For development, use mock data
  const user = MOCK_USERS.find(u => u.email === email);
  
  // For testing purposes, allow login with any email that contains "test" or "admin"
  // This makes it easier to test the application without hardcoding credentials
  if (!user) {
    if (email.includes('test') || email.includes('admin')) {
      // Create a new test user on the fly
      const newUser = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email: email,
        voterId: `VOTER${Math.floor(Math.random() * 10000)}`,
        isAdmin: email.includes('admin'),
        hasVoted: false
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return newUser;
    }
    
    throw new Error('Invalid credentials. Try using an email with "test" or "admin"');
  }
  
  // In a real app, we'd validate the password here
  // For now, any password works with our mock data
  
  // Store in localStorage
  localStorage.setItem('user', JSON.stringify(user));
  
  return user;
};

// Client-side register function
export const clientRegisterUser = async (name: string, email: string, voterId: string, password: string) => {
  // For testing purposes, don't strictly enforce uniqueness on email or voterId
  // In a real app, we would enforce uniqueness
  
  // Create new user with a unique ID based on timestamp
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    voterId,
    isAdmin: email.includes('admin'),
    hasVoted: false
  };
  
  // Add to mock users (in a real app, this would be saved to a database)
  MOCK_USERS.push(newUser);
  
  // Store in localStorage
  localStorage.setItem('user', JSON.stringify(newUser));
  
  console.log(`New user registered: ${name} (${email})`);
  
  return newUser;
};

// Get all candidates
export const clientGetCandidates = async () => {
  // Return candidates from memory (which was loaded from localStorage)
  return MOCK_CANDIDATES;
};

// Vote for a candidate
export const clientVoteForCandidate = async (candidateId: string, userId: string) => {
  // Find the candidate
  const candidateIndex = MOCK_CANDIDATES.findIndex(c => c.id === candidateId);
  
  if (candidateIndex === -1) {
    throw new Error('Candidate not found');
  }
  
  // Get user from localStorage instead of mock data
  const userJson = localStorage.getItem('user');
  if (!userJson) {
    throw new Error('User not found');
  }
  
  const user = JSON.parse(userJson);
  
  if (user.hasVoted) {
    throw new Error('You have already voted');
  }
  
  // Update candidate votes
  MOCK_CANDIDATES[candidateIndex].votes += 1;
  
  // Save updated candidates to localStorage
  localStorage.setItem('candidates', JSON.stringify(MOCK_CANDIDATES));
  
  // Update user's voting status
  user.hasVoted = true;
  localStorage.setItem('user', JSON.stringify(user));
  
  // In a real app, we would save this to a database
  console.log(`Vote recorded for ${MOCK_CANDIDATES[candidateIndex].name}`);
  
  return {
    success: true,
    message: 'Vote recorded successfully',
    candidate: MOCK_CANDIDATES[candidateIndex]
  };
};

// Get election results
export const clientGetElectionResults = async () => {
  // Calculate total votes
  const totalVotes = MOCK_CANDIDATES.reduce((sum, candidate) => sum + candidate.votes, 0);
  
  // Calculate percentages and find winner
  const candidatesWithPercentage = MOCK_CANDIDATES.map(candidate => {
    const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
    return {
      ...candidate,
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
    };
  });
  
  // Find winning candidate
  let winningCandidate = null;
  let winningParty = null;
  
  if (totalVotes > 0) {
    const winner = [...candidatesWithPercentage].sort((a, b) => b.votes - a.votes)[0];
    winningCandidate = winner.name;
    winningParty = winner.party;
  }
  
  return {
    candidates: candidatesWithPercentage,
    totalVotes,
    turnoutPercentage: 0, // We don't track total registered voters in client mode
    winningCandidate,
    winningParty
  };
};

// Get regional voting data (mock implementation)
export const clientGetRegionalData = async () => {
  // In client mode, we'll return mock regional data
  return [
    { region: "North", turnout: 68, winner: MOCK_CANDIDATES[0].name },
    { region: "South", turnout: 72, winner: MOCK_CANDIDATES[1].name },
    { region: "East", turnout: 65, winner: MOCK_CANDIDATES[2].name },
    { region: "West", turnout: 70, winner: MOCK_CANDIDATES[0].name },
    { region: "Central", turnout: 75, winner: MOCK_CANDIDATES[0].name },
  ];
};

// Update candidate information
export const clientUpdateCandidate = async (candidateId: string, updatedData: Partial<Candidate>) => {
  const candidateIndex = MOCK_CANDIDATES.findIndex(c => c.id === candidateId);
  
  if (candidateIndex === -1) {
    throw new Error('Candidate not found');
  }
  
  // Update candidate data
  MOCK_CANDIDATES[candidateIndex] = {
    ...MOCK_CANDIDATES[candidateIndex],
    ...updatedData
  };
  
  // Save to localStorage
  localStorage.setItem('candidates', JSON.stringify(MOCK_CANDIDATES));
  
  return MOCK_CANDIDATES[candidateIndex];
};
