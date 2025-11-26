import type { UserProfile, ActivityItem, SavedItem, JournalEntry, UserLists } from '@/types/profile';

// Mock user profiles
export const MOCK_PROFILES: Record<string, UserProfile> = {
  'current-user': {
    id: 'current-user',
    name: 'Jamie Chen',
    alias: 'Sunflower22',
    bio: 'Finding light in small moments. Book lover, playlist curator, and soft chaos enthusiast. Here for the gentle community vibes. 🌻',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie',
    joinedDate: '2024-01-15',
    stats: {
      posts: 47,
      journals: 12,
      saved: 23,
      followers: 156,
      following: 89,
    },
  },
  'user-2': {
    id: 'user-2',
    name: 'Alex Rivera',
    alias: 'MidnightReader',
    bio: 'Late night thinker. Always here for book recs and nostalgic music.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    joinedDate: '2024-02-20',
    stats: {
      posts: 32,
      journals: 0,
      saved: 0,
      followers: 92,
      following: 67,
    },
    isFollowing: false,
  },
  'user-3': {
    id: 'user-3',
    name: 'Sam Taylor',
    alias: 'CozyVibes',
    bio: '✨ comfort watch connoisseur • soft chaos • here for the feels',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    joinedDate: '2024-03-10',
    stats: {
      posts: 28,
      journals: 0,
      saved: 0,
      followers: 134,
      following: 112,
    },
    isFollowing: true,
  },
};

// Mock activity for current user
export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'lounge',
    title: 'Joy',
    body: 'Just finished organizing my bookshelf by color and it brought me so much peace. Small wins today 📚✨',
    timestamp: '2024-11-25T14:30:00Z',
    isAnonymous: false,
    roomName: 'The Lounge',
    link: '/lounge/1',
  },
  {
    id: 'act-2',
    type: 'music',
    title: 'Added "Ordinary People" by John Legend',
    body: 'For when you\'re processing feelings and need a good reflective cry.',
    timestamp: '2024-11-24T19:15:00Z',
    isAnonymous: true,
    roomName: 'Music Room',
    link: '/music-room/2',
  },
  {
    id: 'act-3',
    type: 'inspo',
    title: 'Posted inspiration',
    body: 'You don\'t have to earn rest. You don\'t have to prove you deserve it. Rest is not a reward—it\'s a right.',
    timestamp: '2024-11-23T10:45:00Z',
    isAnonymous: false,
    roomName: 'Inspo Wall',
    link: '/inspo-wall/1',
  },
  {
    id: 'act-4',
    type: 'dilemma',
    title: 'Shared perspective',
    body: 'I went through something similar last year. What helped me was setting really clear boundaries and sticking to them, even when it felt awkward.',
    timestamp: '2024-11-22T16:20:00Z',
    isAnonymous: true,
    roomName: 'Dilemmas',
    link: '/dilemmas/1',
  },
  {
    id: 'act-5',
    type: 'book',
    title: 'Commented on "All About Love"',
    body: 'The way she breaks down the difference between care, affection and love made me realise how low my bar has been.',
    timestamp: '2024-11-21T11:00:00Z',
    isAnonymous: false,
    roomName: 'Book Club',
    link: '/book-club/1',
  },
];

// Mock saved items
export const MOCK_SAVED: SavedItem[] = [
  {
    id: 'save-1',
    type: 'song',
    title: 'Say My Name - Destiny\'s Child',
    description: 'Instant throwback energy. Great for cleaning or getting ready.',
    savedAt: '2024-11-20T14:30:00Z',
    link: '/music-room/1',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
  },
  {
    id: 'save-2',
    type: 'book',
    title: 'All About Love - bell hooks',
    description: 'Good for unlearning old ideas about love without feeling attacked.',
    savedAt: '2024-11-18T09:15:00Z',
    link: '/book-club/1',
  },
  {
    id: 'save-3',
    type: 'post',
    title: 'Hope story: Found my people',
    description: 'A story about finding community after years of isolation.',
    savedAt: '2024-11-15T16:45:00Z',
    link: '/hope-bank/1',
  },
  {
    id: 'save-4',
    type: 'show',
    title: 'Fleabag',
    description: 'Comfort watch with just the right amount of chaos.',
    savedAt: '2024-11-12T12:20:00Z',
    link: '/tv-movies/1',
  },
];

// Mock journal entries
export const MOCK_JOURNALS: JournalEntry[] = [
  {
    id: 'journal-1',
    title: 'Reflections on rest',
    body: 'Today I learned that taking a break doesn\'t mean I\'m being lazy. My therapist reminded me that rest is productive. I\'m trying to internalize this.',
    mood: 'Thoughtful',
    createdAt: '2024-11-24T21:00:00Z',
    tags: ['self-care', 'therapy', 'rest'],
  },
  {
    id: 'journal-2',
    title: 'Gratitude list',
    body: 'Three things I\'m grateful for today:\n1. Morning coffee with a friend\n2. The way sunlight came through my window\n3. Finding this community',
    mood: 'Content',
    createdAt: '2024-11-22T08:30:00Z',
    tags: ['gratitude'],
  },
  {
    id: 'journal-3',
    title: 'Processing a hard conversation',
    body: 'Had to set a boundary with a family member today. It was uncomfortable but necessary. I\'m proud of myself for speaking up, even though my voice shook.',
    mood: 'Proud but tired',
    createdAt: '2024-11-20T19:45:00Z',
    tags: ['boundaries', 'family', 'growth'],
  },
  {
    id: 'journal-4',
    title: 'Book thoughts',
    body: 'Started reading "All About Love" and it\'s already shifting how I think about relationships. Page 23 hit different.',
    mood: 'Reflective',
    createdAt: '2024-11-18T22:15:00Z',
    tags: ['books', 'love', 'reflection'],
  },
];

// Mock lists
export const MOCK_LISTS: UserLists = {
  readList: [
    {
      id: 'read-1',
      title: 'All About Love',
      subtitle: 'bell hooks',
      status: 'Reading',
      addedAt: '2024-11-18T10:00:00Z',
      note: 'Currently on chapter 3. Already so good.',
    },
    {
      id: 'read-2',
      title: 'The Alchemist',
      subtitle: 'Paulo Coelho',
      status: 'Finished',
      addedAt: '2024-10-15T14:20:00Z',
      rating: 4,
      note: 'Beautiful but a bit too neat at the end.',
    },
    {
      id: 'read-3',
      title: 'Homegoing',
      subtitle: 'Yaa Gyasi',
      status: 'To read',
      addedAt: '2024-11-10T09:30:00Z',
    },
  ],
  watchList: [
    {
      id: 'watch-1',
      title: 'Fleabag',
      subtitle: 'TV Series',
      status: 'Watched',
      imageUrl: 'https://images.unsplash.com/photo-1574267432644-f617c4a5d5b7?w=400&h=600&fit=crop',
      addedAt: '2024-10-01T12:00:00Z',
      rating: 5,
      note: 'Rewatched for the third time. Still perfect.',
    },
    {
      id: 'watch-2',
      title: 'Everything Everywhere All at Once',
      subtitle: 'Movie',
      status: 'Want to watch',
      addedAt: '2024-11-15T16:45:00Z',
    },
    {
      id: 'watch-3',
      title: 'Ted Lasso',
      subtitle: 'TV Series',
      status: 'Watching',
      addedAt: '2024-11-05T20:10:00Z',
      note: 'Season 2, episode 5. The wholesomeness is healing.',
    },
  ],
  listenList: [
    {
      id: 'listen-1',
      title: 'Say My Name',
      subtitle: 'Destiny\'s Child',
      status: 'Listening',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
      addedAt: '2024-11-20T14:30:00Z',
      note: 'On repeat this week.',
    },
    {
      id: 'listen-2',
      title: 'Ordinary People',
      subtitle: 'John Legend',
      status: 'Listened',
      addedAt: '2024-11-12T19:15:00Z',
    },
    {
      id: 'listen-3',
      title: 'Just Fine',
      subtitle: 'Mary J. Blige',
      status: 'Listening',
      addedAt: '2024-11-18T11:00:00Z',
    },
  ],
};

// Function to get profile by ID
export function getProfileById(id: string): UserProfile | null {
  return MOCK_PROFILES[id] || null;
}

// Function to check if viewing own profile
export function isOwnProfile(profileId: string, currentUserId: string): boolean {
  return profileId === currentUserId;
}
