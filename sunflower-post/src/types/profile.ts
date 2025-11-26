// Profile types for the Sunflower Post app

export type UserProfile = {
  id: string;
  name: string;
  alias: string;
  bio?: string;
  avatarUrl?: string;
  joinedDate: string;
  stats: {
    posts: number;
    journals: number;
    saved: number;
    followers: number;
    following: number;
  };
  isFollowing?: boolean;
};

export type ActivityItem = {
  id: string;
  type: 'lounge' | 'dilemma' | 'hope' | 'inspo' | 'music' | 'tv-movie' | 'book';
  title: string;
  body: string;
  timestamp: string;
  isAnonymous: boolean;
  roomName: string;
  link: string;
};

export type SavedItem = {
  id: string;
  type: 'post' | 'song' | 'show' | 'book';
  title: string;
  description?: string;
  savedAt: string;
  link: string;
  imageUrl?: string;
};

export type JournalEntry = {
  id: string;
  title: string;
  body: string;
  mood?: string;
  createdAt: string;
  tags?: string[];
};

export type ListItem = {
  id: string;
  title: string;
  subtitle?: string;
  status: 'To read' | 'Reading' | 'Finished' | 'Watching' | 'Watched' | 'Want to watch' | 'Listening' | 'Listened';
  imageUrl?: string;
  addedAt: string;
  rating?: number;
  note?: string;
};

export type UserLists = {
  readList: ListItem[];
  watchList: ListItem[];
  listenList: ListItem[];
};
