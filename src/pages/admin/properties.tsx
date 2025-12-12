import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { PropertyApprovalTable } from '@/components/admin/PropertyApprovalTable';

export default function AdminProperties() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  
  // Mock counts for UI (PropertyApprovalTable has its own mock data)
  const pendingCount = 3;
  const approvedCount = 1;
  const rejectedCount = 1;

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
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Tabs */}
            <Tabs 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value)}
            >
              <TabsList>
                <TabsTrigger value="pending">
                  Pending
                  {pendingCount > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                      {pendingCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                    {approvedCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected
                  <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800">
                    {rejectedCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>

              <TabsContent value={statusFilter} className="mt-6">
                <PropertyApprovalTable />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
