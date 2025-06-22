export interface Author {
  name: string;
  avatar: string;
  role: string;
  time: string;
}

export interface PostType {
  id: number;
  author: Author;
  content: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface StoryType {
  id: number;
  user: string;
  image: string;
  isAdd?: boolean;
}

export interface FriendSuggestionType {
  id: number;
  name: string;
  mutualFriends: number;
  avatar: string;
}
