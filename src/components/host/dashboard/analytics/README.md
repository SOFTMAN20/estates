# Analytics Components

This folder contains all analytics-related components for the NyumbaLink dashboard.

## Components

### AnalyticsOverview.tsx
Main analytics dashboard that displays comprehensive property performance metrics. Includes:
- Summary statistics cards (Revenue, Bookings, Occupancy, Rating)
- Time range selector (7d, 30d, 90d, 1y)
- Tabbed interface for different analytics views
- Integration with all other analytics components

### AnalyticsModal.tsx
Modal wrapper for displaying analytics. Can be triggered from property cards with "View Analytics" button.

### PropertyPerformance.tsx
Displays key performance indicators for individual properties:
- Total Revenue
- Total Bookings
- Unique Guests
- Average Rating

### RevenueChart.tsx
Line chart showing revenue trends over time with:
- Revenue line
- Expenses line
- Profit line

### OccupancyChart.tsx
Bar chart displaying occupancy rates:
- Occupied percentage
- Available percentage

### BookingsChart.tsx
Area chart showing booking trends:
- Total bookings
- Cancellations

### PropertyComparison.tsx
Comparative analysis of multiple properties:
- Revenue comparison bar chart
- Bookings and ratings summary

### ReviewsAnalytics.tsx
Review and rating analytics:
- Average rating display
- Rating distribution (5-star breakdown)
- Category ratings (Cleanliness, Communication, etc.)

### EarningsBreakdown.tsx
Detailed income and expense breakdown:
- Income sources pie chart
- Expense categories with progress bars
- Net income calculation

## Usage

### In Property Grid (Current Implementation)
```tsx
import AnalyticsModal from '@/components/dashboard/analytics/AnalyticsModal';

// In component
const [analyticsModal, setAnalyticsModal] = useState({ isOpen: false, property: null });

// Trigger button
<Button onClick={() => setAnalyticsModal({ isOpen: true, property })}>
  View Analytics
</Button>

// Modal
<AnalyticsModal
  open={analyticsModal.isOpen}
  onOpenChange={(open) => setAnalyticsModal({ isOpen: open, property: null })}
  propertyId={analyticsModal.property?.id}
  propertyName={analyticsModal.property?.title}
/>
```

### As Standalone Page
```tsx
import { AnalyticsOverview } from '@/components/dashboard/analytics';

function AnalyticsPage() {
  return <AnalyticsOverview propertyId={propertyId} />;
}
```

## Data Integration

Currently using mock data. To integrate with real data:

1. Create analytics hooks in `src/hooks/analyticsHooks/`
2. Fetch data from Supabase
3. Replace mock data in each component with real data from hooks

Example:
```tsx
// src/hooks/analyticsHooks/usePropertyAnalytics.ts
export function usePropertyAnalytics(propertyId?: string) {
  return useQuery({
    queryKey: ['analytics', propertyId],
    queryFn: () => fetchAnalytics(propertyId),
  });
}
```

## Dependencies

- recharts: For all chart components
- @/components/ui: Shadcn UI components (Card, Dialog, Tabs, Progress, etc.)
- lucide-react: Icons
