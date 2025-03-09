import mongoose, { Model } from 'mongoose';
import { Candidate as ICandidateConfig } from '@/config/candidates';

// Define the TypeScript interface for Candidate
export interface ICandidate extends Omit<ICandidateConfig, 'id'>, mongoose.Document {
  votes: number;
}

// Create the schema
const CandidateSchema = new mongoose.Schema<ICandidate>({
  name: {
    type: String,
    required: [true, 'Please provide candidate name'],
    maxLength: [50, 'Name cannot be more than 50 characters'],
  },
  party: {
    type: String,
    required: [true, 'Please provide party name'],
  },
  position: {
    type: String,
    required: [true, 'Please provide position'],
  },
  bio: {
    type: String,
    required: [true, 'Please provide bio'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide image URL'],
  },
  age: {
    type: Number,
  },
  education: {
    type: String,
  },
  experience: {
    type: String,
  },
  manifesto: {
    type: String,
  },
  votes: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
  },
});

// Create and export the Candidate model
let Candidate: Model<ICandidate>;

try {
  // Try to get the existing model
  Candidate = mongoose.model<ICandidate>('Candidate');
} catch {
  // If the model doesn't exist, create it
  Candidate = mongoose.model<ICandidate>('Candidate', CandidateSchema);
}

export default Candidate;
