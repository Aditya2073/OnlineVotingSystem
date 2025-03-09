import mongoose, { Model } from 'mongoose';

// Define the TypeScript interface for Vote
export interface IVote extends mongoose.Document {
  candidateId: string;
  userId: mongoose.Types.ObjectId;
  timestamp: Date;
}

// Define the Vote schema
const VoteSchema = new mongoose.Schema<IVote>({
  candidateId: {
    type: String,
    required: [true, 'Candidate ID is required'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

// Create and export the Vote model
let Vote: Model<IVote>;

try {
  // Try to get the existing model
  Vote = mongoose.model<IVote>('Vote');
} catch {
  // If the model doesn't exist, create it
  Vote = mongoose.model<IVote>('Vote', VoteSchema);
}

export default Vote;
