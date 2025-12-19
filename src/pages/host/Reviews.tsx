import { useState } from 'react';
import { Star, Filter, TrendingUp, MessageSquare } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';
import { ReviewList } from '@/components/reviews/ReviewList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingStars } from '@/components/reviews/RatingStars';

export default function HostReviews() {
  const { hostReviews, isLoading } = useReviews(undefined, {});
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [filterResponse, setFilterResponse] = useState<string>('all');

  // Get unique properties from reviews
  const properties = Array.from(
    new Set(hostReviews.map(r => r.property?.id).filter(Boolean))
  ).map(id => {
    const review = hostReviews.find(r => r.property?.id === id);
    return {
      id: id!,
      title: review?.property?.title || 'Unknown Property'
    };
  });

  // Filter reviews
  let filteredReviews = [...hostReviews];
  
  if (filterProperty !== 'all') {
    filteredReviews = filteredReviews.filter(r => r.property?.id === filterProperty);
  }
  
  if (filterRating !== 'all') {
    const rating = parseInt(filterRating);
    filteredReviews = filteredReviews.filter(r => r.rating === rating);
  }
  
  if (filterResponse === 'responded') {
    filteredReviews = filteredReviews.filter(r => r.host_response);
  } else if (filterResponse === 'no_response') {
    filteredReviews = filteredReviews.filter(r => !r.host_response);
  }

  // Calculate statistics
  const totalReviews = hostReviews.length;
  const averageRating = totalReviews > 0
    ? hostReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;
  const responseRate = totalReviews > 0
    ? (hostReviews.filter(r => r.host_response).length / totalReviews) * 100
    : 0;
  const recentTrend = hostReviews.slice(0, 5).length > 0
    ? hostReviews.slice(0, 5).reduce((sum, r) => sum + r.rating, 0) / Math.min(5, hostReviews.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Reviews</h1>
              <p className="text-gray-600">
                Manage and respond to guest reviews
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </span>
                  <RatingStars value={averageRating} size="sm" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {totalReviews}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Response Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {responseRate.toFixed(0)}%
                  </span>
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Recent Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {recentTrend.toFixed(1)}
                  </span>
                  <TrendingUp className={`w-5 h-5 ${recentTrend >= averageRating ? 'text-green-500' : 'text-red-500'}`} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-gray-500" />
          
          {properties.length > 1 && (
            <Select value={filterProperty} onValueChange={setFilterProperty}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterResponse} onValueChange={setFilterResponse}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Response Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="no_response">No Response</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ReviewList
              reviews={filteredReviews}
              isHostView={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
