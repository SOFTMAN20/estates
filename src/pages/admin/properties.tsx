import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Loader2, ArrowUpDown } from 'lucide-react';
import { PropertyApprovalTable } from '@/components/admin/PropertyApprovalTable';
import { usePropertyCounts } from '@/hooks/useAdminProperties';

export type SortOption = 'date_desc' | 'date_asc' | 'price_desc' | 'price_asc' | 'status';

export default function AdminProperties() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  
  // Fetch real property counts
  const { data: counts, isLoading: countsLoading } = usePropertyCounts();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600 mt-2">Review and approve property listings</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by title, location, or host name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[200px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">Date Added (Newest)</SelectItem>
                  <SelectItem value="date_asc">Date Added (Oldest)</SelectItem>
                  <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                  <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabs */}
            <Tabs 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value)}
            >
              <TabsList>
                <TabsTrigger value="pending">
                  Pending
                  {countsLoading ? (
                    <Loader2 className="h-3 w-3 ml-2 animate-spin" />
                  ) : counts && counts.pending > 0 ? (
                    <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                      {counts.pending}
                    </Badge>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved
                  {countsLoading ? (
                    <Loader2 className="h-3 w-3 ml-2 animate-spin" />
                  ) : counts ? (
                    <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                      {counts.approved}
                    </Badge>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected
                  {countsLoading ? (
                    <Loader2 className="h-3 w-3 ml-2 animate-spin" />
                  ) : counts ? (
                    <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800">
                      {counts.rejected}
                    </Badge>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger value="all">
                  All
                  {countsLoading ? (
                    <Loader2 className="h-3 w-3 ml-2 animate-spin" />
                  ) : counts ? (
                    <Badge variant="secondary" className="ml-2">
                      {counts.all}
                    </Badge>
                  ) : null}
                </TabsTrigger>
              </TabsList>

              <TabsContent value={statusFilter} className="mt-6">
                <PropertyApprovalTable 
                  statusFilter={statusFilter}
                  searchQuery={searchQuery}
                  sortBy={sortBy}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
