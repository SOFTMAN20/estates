export interface Review {
  id: string;
  property_id: string;
  booking_id: string;
  user_id: string;
  rating: number;
  cleanliness?: number;
  accuracy?: number;
  communication?: number;
  location_rating?: number;
  value?: number;
  comment: string;
  images?: string[];
  host_response?: string;
  host_response_date?: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  
  // Joined data
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  property?: {
    id: string;
    title: string;
    images: string[];
  };
  booking?: {
    check_in: string;
    check_out: string;
  };
}

export interface ReviewFormData {
  property_id: string;
  booking_id: string;
  rating: number;
  cleanliness?: number;
  accuracy?: number;
  communication?: number;
  location_rating?: number;
  value?: number;
  comment: string;
  images?: File[];
}

export interface ReviewStatistics {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    '5_star': number;
    '4_star': number;
    '3_star': number;
    '2_star': number;
    '1_star': number;
  };
  category_averages: {
    cleanliness: number;
    communication: number;
    value: number;
    location: number;
  };
  recommendation_rate: number;
}

export interface ReviewFilters {
  rating?: number;
  hasResponse?: boolean;
  sortBy?: 'recent' | 'highest' | 'lowest' | 'helpful';
}

export type ReviewSortOption = 'recent' | 'highest' | 'lowest' | 'helpful';
