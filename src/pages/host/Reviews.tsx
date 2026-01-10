import { useState } from 'react';
import { Star, Filter, TrendingUp, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReviews } from '@/hooks/useReviews';
import { ReviewList } from '@/components/reviews/ReviewList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/reviews/RatingStars';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function HostReviews() {
  const navigate = useNavigate();
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

  // Count reviews needing response
  const needsResponse = hostReviews.filter(r => !r.host_response).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button - Mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/host/dashboard')}
          className="mb-4 -ml-2 sm:hidden"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Dashboard
        </Button>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Property Reviews</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage and respond to guest reviews
              </p>
            </div>
          </div>

          {/* Needs Response Alert */}
          {needsResponse > 0 && (
            <div className="mt-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">{needsResponse}</span> review{needsResponse !== 1 ? 's' : ''} awaiting your response
              </p>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="bg-white">
            <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <RatingStars value={averageRating} size="sm" className="hidden sm:flex" />
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 sm:hidden" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Total Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                {totalReviews}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Response Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {responseRate.toFixed(0)}%
                </span>
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Recent Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {recentTrend.toFixed(1)}
                </span>
                <TrendingUp className={`w-4 h-4 sm:w-5 sm:h-5 ${recentTrend >= averageRating ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {properties.length > 1 && (
              <Select value={filterProperty} onValueChange={setFilterProperty}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {properties.map(property => (
                    <SelectItem key={property.id} value={property.id}>
                      <span className="truncate">{property.title}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                <SelectItem value="1">⭐ 1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterResponse} onValueChange={setFilterResponse}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Response Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="responded">✓ Responded</SelectItem>
                <SelectItem value="no_response">⏳ Needs Response</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-600">Loading reviews...</p>
            </div>
          ) : hostReviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                When guests leave reviews for your properties, they will appear here.
              </p>
            </div>
          ) : (
            <ReviewList
              reviews={filteredReviews}
              isHostView={true}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
