export interface Article {
  item_id: number;
  status: 0 | 1 | 2; // 0=active, 1=archived, 2=deleted
  favorite: boolean;
  given_url: string;
  given_title?: string;
  resolved_title?: string;
  resolved_url?: string;
  excerpt?: string;
  has_video: 0 | 1 | 2;
  has_image: 0 | 1 | 2;
  word_count?: number;
  time_added: string;
  time_updated?: string;
  top_image_url?: string;
  domain?: {
    domain_id: number;
    name: string;
  };
  author?: {
    id: number;
    name: string;
  };
  tags?: string[];
}

export type FilterStatus = 'all' | 'active' | 'archived' | 'deleted';
export type SortOption = 'newest' | 'oldest' | 'updated' | 'word_count';
export type NavSection = 'all' | 'favorites' | 'archived' | 'tags';
