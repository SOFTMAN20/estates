import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';

interface ReviewsAnalyticsProps {
  data: {
    averageRating: number;
    totalReviews: number;
    distribution: { stars: number; count: number; percentage: number }[];
    categories: { name: string; rating: number }[];
  };
  propertyId?: string;
}

export default function ReviewsAnalytics({ data, propertyId }: ReviewsAnalyticsProps) {
  const reviewStats = data;

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            ⭐ Rating Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="mb-6 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-gray-900">{reviewStats.averageRating}</div>
            <div className="flex justify-center my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    star <= Math.round(reviewStats.averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Based on {reviewStats.totalReviews} reviews
            </div>
          </div>

          <div className="space-y-3">
            {reviewStats.distribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 w-10 sm:w-12">
                  <span className="text-xs sm:text-sm font-medium">{item.stars}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress value={item.percentage} className="flex-1 h-2" />
                <span className="text-xs sm:text-sm text-muted-foreground w-8 sm:w-12 text-right font-medium">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            📊 Category Ratings
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="space-y-4">
            {reviewStats.categories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium">{category.name}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground font-bold">{category.rating}</span>
                </div>
                <Progress value={category.rating * 20} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
