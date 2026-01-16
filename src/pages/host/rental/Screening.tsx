/**
 * SCREENING PAGE - Tenant screening and background checks
 */

import React, { useState } from 'react';
import RentalManagerLayout from '@/components/host/rental/RentalManagerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, Plus, UserCheck, MoreHorizontal, 
  CheckCircle2, Clock, XCircle, AlertTriangle,
  FileText, Phone, Mail, Eye, Shield, Star
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';

const mockScreenings = [
  {
    id: '1',
    applicantName: 'James Mwakasege',
    applicantAvatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop&crop=face',
    email: 'james.mwakasege@email.com',
    phone: '+255 712 555 666',
    property: 'Modern 2BR Apartment',
    appliedDate: '2025-01-10',
    status: 'approved',
    creditScore: 720,
    incomeVerified: true,
    employmentVerified: true,
    backgroundCheck: 'clear',
    references: 3,
    score: 92
  },
  {
    id: '2',
    applicantName: 'Fatima Ally',
    applicantAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face',
    email: 'fatima.ally@email.com',
    phone: '+255 754 777 888',
    property: 'Mikocheni Guest House',
    appliedDate: '2025-01-12',
    status: 'pending',
    creditScore: 680,
    incomeVerified: true,
    employmentVerified: false,
    backgroundCheck: 'pending',
    references: 2,
    score: 65
  },
  {
    id: '3',
    applicantName: 'Robert Kimambo',
    applicantAvatar: 'https://images.unsplash.com/photo-1507152927003-f7312a0a313c?w=100&h=100&fit=crop&crop=face',
    email: 'robert.kimambo@email.com',
    phone: '+255 789 999 000',
    property: 'Mbezi Beach Apartments',
    appliedDate: '2025-01-08',
    status: 'rejected',
    creditScore: 520,
    incomeVerified: false,
    employmentVerified: false,
    backgroundCheck: 'issues',
    references: 1,
    score: 35
  },
  {
    id: '4',
    applicantName: 'Elizabeth Mwamba',
    applicantAvatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=100&h=100&fit=crop&crop=face',
    email: 'elizabeth.mwamba@email.com',
    phone: '+255 765 111 222',
    property: 'Oyster Bay Villa',
    appliedDate: '2025-01-14',
    status: 'in_review',
    creditScore: 750,
    incomeVerified: true,
    employmentVerified: true,
    backgroundCheck: 'pending',
    references: 4,
    score: 78
  },
  {
    id: '5',
    applicantName: 'Hassan Juma',
    applicantAvatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop&crop=face',
    email: 'hassan.juma@email.com',
    phone: '+255 712 333 444',
    property: 'Mikocheni Guest House',
    appliedDate: '2025-01-15',
    status: 'pending',
    creditScore: null,
    incomeVerified: false,
    employmentVerified: false,
    backgroundCheck: 'not_started',
    references: 0,
    score: 20
  }
];

const Screening = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_review' | 'approved' | 'rejected'>('all');

  const filteredScreenings = mockScreenings.filter(screening => {
    const matchesSearch = screening.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         screening.property.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && screening.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 border-0 gap-1"><CheckCircle2 className="h-3 w-3" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-0 gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'in_review':
        return <Badge className="bg-blue-100 text-blue-700 border-0 gap-1"><Eye className="h-3 w-3" />In Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-0 gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const stats = {
    total: mockScreenings.length,
    pending: mockScreenings.filter(s => s.status === 'pending').length,
    inReview: mockScreenings.filter(s => s.status === 'in_review').length,
    approved: mockScreenings.filter(s => s.status === 'approved').length,
    rejected: mockScreenings.filter(s => s.status === 'rejected').length,
  };

  return (
    <RentalManagerLayout 
      title="Tenant Screening" 
      subtitle="Review and verify applicants"
      action={
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Screening
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <button onClick={() => setFilter('all')} className={`p-3 rounded-lg border text-left transition-colors ${filter === 'all' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </button>
        <button onClick={() => setFilter('pending')} className={`p-3 rounded-lg border text-left transition-colors ${filter === 'pending' ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </button>
        <button onClick={() => setFilter('in_review')} className={`p-3 rounded-lg border text-left transition-colors ${filter === 'in_review' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <p className="text-2xl font-bold text-blue-600">{stats.inReview}</p>
          <p className="text-sm text-gray-500">In Review</p>
        </button>
        <button onClick={() => setFilter('approved')} className={`p-3 rounded-lg border text-left transition-colors ${filter === 'approved' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-sm text-gray-500">Approved</p>
        </button>
        <button onClick={() => setFilter('rejected')} className={`p-3 rounded-lg border text-left transition-colors ${filter === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-sm text-gray-500">Rejected</p>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search applicants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      {/* Screenings List */}
      <div className="space-y-3">
        {filteredScreenings.map((screening) => (
          <Card key={screening.id} className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Avatar & Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative">
                    <img
                      src={screening.applicantAvatar}
                      alt={screening.applicantName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{screening.applicantName}</h3>
                    <p className="text-sm text-gray-500 truncate">{screening.property}</p>
                    <p className="text-xs text-gray-400">Applied {new Date(screening.appliedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>

                {/* Verification Checks */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${screening.incomeVerified ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-xs text-gray-600">Income</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${screening.employmentVerified ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-xs text-gray-600">Employment</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${screening.backgroundCheck === 'clear' ? 'bg-green-500' : screening.backgroundCheck === 'issues' ? 'bg-red-500' : 'bg-gray-300'}`} />
                    <span className="text-xs text-gray-600">Background</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-gray-600">{screening.references} refs</span>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-3 min-w-[120px]">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Score</span>
                      <span className={`text-sm font-bold ${getScoreColor(screening.score)}`}>{screening.score}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getProgressColor(screening.score)}`}
                        style={{ width: `${screening.score}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {getStatusBadge(screening.status)}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Phone className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Mail className="h-3.5 w-3.5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View Full Report</DropdownMenuItem>
                      <DropdownMenuItem><FileText className="h-4 w-4 mr-2" />View Application</DropdownMenuItem>
                      <DropdownMenuItem><Shield className="h-4 w-4 mr-2" />Run Background Check</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-green-600"><CheckCircle2 className="h-4 w-4 mr-2" />Approve</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600"><XCircle className="h-4 w-4 mr-2" />Reject</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredScreenings.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No screenings found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </RentalManagerLayout>
  );
};

export default Screening;
