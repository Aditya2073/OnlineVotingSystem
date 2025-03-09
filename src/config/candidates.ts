// Central configuration for candidates
// This file serves as the single source of truth for candidate information

export type Candidate = {
  id: string;
  name: string;
  party: string;
  position: string;
  bio: string;
  imageUrl: string;
  age?: number;
  education?: string;
  experience?: string;
  manifesto?: string;
  votes: number;
  color?: string;
};

// Default candidates data
export const DEFAULT_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Aditya Chavan',
    party: 'Congress',
    position: 'Chief Minister',
    bio: 'Experienced leader with a vision for the future.',
    imageUrl: '/Aditya.png',
    age: 45,
    education: 'Ph.D in Political Science',
    experience: 'Former State Minister (2015-2020)',
    manifesto: 'Economic reforms, healthcare accessibility, and education improvements.',
    votes: 0,
    color: '#1a365d'
  },
  {
    id: '2',
    name: 'Bhagavat Dhawale',
    party: 'Shiv Sena',
    position: 'Chief Minister',
    bio: 'Dedicated to serving the community and making positive change.',
    imageUrl: '/Bhagavat.png',
    age: 38,
    education: 'MBA, Public Administration',
    experience: 'Social Activist, City Council Member (2018-2022)',
    manifesto: 'Environmental protection, women\'s rights, and rural development.',
    votes: 0,
    color: '#ff9933'
  },
  {
    id: '3',
    name: 'Rajesh Kumar',
    party: 'Party C',
    position: 'President',
    bio: 'Bringing fresh ideas and innovative solutions.',
    imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    age: 52,
    education: 'Law Degree',
    experience: 'Senior Advocate, Member of Parliament (2010-2020)',
    manifesto: 'Judicial reforms, infrastructure development, and farmers\' welfare.',
    votes: 0,
    color: '#138808'
  },
  {
    id: '4',
    name: 'Sakshi Karale',
    party: 'Aam Aadmi Party',
    position: 'Chief Minister',
    bio: 'Focused on economic growth and technological advancement.',
    imageUrl: '/Sakshi.png',
    age: 41,
    education: 'Masters in Economics',
    experience: 'Financial Advisor, District Chairperson (2016-2022)',
    manifesto: 'Economic growth, youth employment, and technological advancement.',
    votes: 0,
    color: '#9333ea'
  }
];

// Function to get a deep copy of the default candidates
// This prevents accidental mutation of the original data
export const getDefaultCandidates = (): Candidate[] => {
  return JSON.parse(JSON.stringify(DEFAULT_CANDIDATES));
};
