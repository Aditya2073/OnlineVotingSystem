import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User';
import Vote from './models/Vote';
import { DEFAULT_CANDIDATES, getDefaultCandidates } from './config/candidates';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.VITE_MONGODB_URI || 'mongodb://127.0.0.1:27017/voting-app';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err: Error) => console.error('MongoDB connection error:', err));

// Get all candidates with their vote counts
app.get('/api/candidates', async (req, res) => {
  try {
    // Get vote counts for each candidate
    const voteCounts = await Vote.aggregate([
      { $group: { _id: "$candidateId", count: { $sum: 1 } } }
    ]);

    // Create a map of candidate ID to vote count
    const voteMap = new Map(voteCounts.map(v => [v._id, v.count]));

    // Combine static candidate data with vote counts
    const candidates = getDefaultCandidates().map(candidate => ({
      ...candidate,
      votes: voteMap.get(candidate.id) || 0
    }));

    res.json(candidates);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching candidates:', error);
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to fetch candidates' });
    }
  }
});

// Vote for a candidate
app.post('/api/candidates/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    console.log('Vote attempt:', { candidateId: id, userId });

    // Check if user exists and hasn't voted
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', { 
      userId: user._id, 
      name: user.name, 
      hasVoted: user.hasVoted 
    });

    // Check if user has already voted
    const existingVote = await Vote.findOne({ userId: user._id });
    if (existingVote) {
      console.log('User has already voted:', existingVote);
      return res.status(400).json({ message: 'User has already voted' });
    }

    // Check if candidate exists
    const candidate = getDefaultCandidates().find(c => c.id === id);
    if (!candidate) {
      console.log('Candidate not found:', id);
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Create vote record
    const vote = await Vote.create({
      candidateId: id,
      userId: user._id,
      timestamp: new Date()
    });

    console.log('Vote created:', vote);

    // Mark user as voted using updateOne for atomic update
    const updateResult = await User.updateOne(
      { _id: userId },
      { $set: { hasVoted: true } }
    );

    console.log('User update result:', updateResult);

    if (updateResult.modifiedCount !== 1) {
      console.error('Failed to update user hasVoted status');
      // Consider rolling back the vote if user update fails
      await Vote.deleteOne({ _id: vote._id });
      return res.status(500).json({ message: 'Failed to update user voting status' });
    }

    // Get updated vote count
    const voteCount = await Vote.countDocuments({ candidateId: id });

    console.log('Final vote count:', { candidateId: id, votes: voteCount });

    // Get updated user to confirm changes
    const updatedUser = await User.findById(userId);
    console.log('Updated user status:', {
      userId: updatedUser?._id,
      hasVoted: updatedUser?.hasVoted
    });

    res.json({
      ...candidate,
      votes: voteCount
    });
  } catch (error) {
    console.error('Error in voting process:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to process vote' });
    }
  }
});

// Get election results
app.get('/api/results', async (req, res) => {
  try {
    console.log('Fetching election results...');

    // Get vote counts for each candidate
    const voteCounts = await Vote.aggregate([
      { $group: { _id: "$candidateId", count: { $sum: 1 } } }
    ]);

    console.log('Vote counts from database:', voteCounts);

    // Create a map of candidate ID to vote count
    const voteMap = new Map(voteCounts.map(v => [v._id, v.count]));

    // Get total number of votes
    const totalVotes = await Vote.countDocuments();
    console.log('Total votes:', totalVotes);

    // Get total number of registered users
    const totalUsers = await User.countDocuments();
    console.log('Total users:', totalUsers);

    // Get users who have voted
    const usersVoted = await User.countDocuments({ hasVoted: true });
    console.log('Users marked as voted:', usersVoted);

    // Combine static candidate data with vote counts and calculate percentages
    const candidates = getDefaultCandidates().map(candidate => {
      const votes = voteMap.get(candidate.id) || 0;
      const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
      return {
        ...candidate,
        votes,
        percentage
      };
    });

    console.log('Processed candidate results:', 
      candidates.map(c => ({ 
        id: c.id, 
        name: c.name, 
        votes: c.votes, 
        percentage: c.percentage 
      }))
    );

    const results = {
      candidates,
      totalVotes,
      turnoutPercentage: totalUsers > 0 ? (totalVotes / totalUsers) * 100 : 0
    };

    res.json(results);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching results:', error);
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to fetch results' });
    }
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, voterId, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { voterId }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      if (existingUser.voterId === voterId) {
        return res.status(400).json({ message: 'Voter ID already registered' });
      }
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      voterId,
      password,
      isAdmin: false,
      hasVoted: false
    });

    // Create safe user object (without password)
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      voterId: user.voterId,
      isAdmin: user.isAdmin,
      hasVoted: user.hasVoted
    };

    res.status(201).json(safeUser);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: error.message || 'Failed to register user' });
    } else {
      console.error('Unknown registration error:', error);
      res.status(500).json({ message: 'Failed to register user' });
    }
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create safe user object (without password)
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      voterId: user.voterId,
      isAdmin: user.isAdmin,
      hasVoted: user.hasVoted
    };

    res.json(safeUser);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Login error:', error);
      res.status(500).json({ message: error.message || 'Failed to login' });
    } else {
      console.error('Unknown login error:', error);
      res.status(500).json({ message: 'Failed to login' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 