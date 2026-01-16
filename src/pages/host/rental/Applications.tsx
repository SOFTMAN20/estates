/**
 * APPLICATIONS PAGE - Rental applications from prospective tenants
 */

import React, { useState } from 'react';
import RentalManagerLayout from '@/components/host/rental/RentalManagerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, CheckCircle2, XCircle, Clock, User, Home, 
  Calendar, Phone, Mail, FileText, MoreHorizontal, Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const mockApplications = [
  {
    id: '1',
    applicant: 'Michael Banda',
    email: 'michael.banda@email.com',
    phone: '+255 712 555 666',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    property: 'Mikocheni Guest House',
    unit: 'Room 4',
    rent: 180000,
    moveInDate: '2025-02-01',
    appliedAt: '2025-01-12',
    status: 'pending',
    employment: 'Software Developer at TechCo',
    income: 1500000
  },
  {
    id: '2',
    applicant: 'Rose Mwakasege',
    email: 'rose.mwakasege@email.com',
    phone: '+255 754 777 888',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    property: 'Mikocheni Guest House',
    unit: 'Room 5',
    rent: 200000,
    moveInDate: '2025-02-15',
    appliedAt: '2025-01-13',
    status: 'pending',
    employment: 'Nurse at Muhimbili Hospital',
    income: 1200000
  },
  {
    id: '3',
    applicant: 'Emmanuel Shirima',
    email: 'emmanuel.shirima@email.com',
    phone: '+255 789 999 000',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop&crop=face',
    property: 'Mbezi Beach Apartments',
    unit: 'Unit 2A - 1BR',
    rent: 400000,
    moveInDate: '2025-02-01',
    appliedAt: '2025-01-10',
    status: 'approved',
    employment: 'Bank Manager at CRDB',
    income: 3000000
  },
  {
    id: '4',
    applicant: 'Fatuma Ally',
    email: 'fatuma.ally@email.com',
    phone: '+255 765 111 222',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face',
    property: 'Sinza Hostel Building',
    unit: 'Room B2',
    rent: 100000,
    moveInDate: '2025-01-20',
    appliedAt: '2025-01-08',
    status: 'rejected',
    employment: 'Student at UDSM',
    income: 0
  }
];

const Applications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = app.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.property.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && app.status === filter;
  });

  const stats = {
    total: mockApplications.length,
    pending: mockApplications.filter(a => a.status === 'pending').length,
    approved: mockApplications.filter(a => a.status === 'approved').length,
    rejected: mockApplications.filter(a => a.status === 'rejected').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-0 gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 border-0 gap-1"><CheckCircle2 className="h-3 w-3" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-0 gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <RentalManagerLayout 
      title="Applications" 
      subtitle="Review rental applications"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <button onClick={() => setFilter('all')} className={`p-3 rounded-lg border text-left transition-colors ${filter === 'all' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </button>
        <button onClick={() => setFilter('pending')} className={`p-3 rounded-lg border text-left transition-colors ${filter === 'pending' ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pending Review</p>
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
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApplications.map((app) => (
          <Card key={app.id} className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Applicant Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={app.avatar}
                    alt={app.applicant}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">{app.applicant}</h3>
                    <p className="text-sm text-gray-500">{app.employment}</p>
                  </div>
                </div>

                {/* Property Info */}
                <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                  <div className="text-sm">
                    <p className="text-gray-500">Property</p>
                    <p className="font-medium text-gray-900">{app.property}</p>
                    <p className="text-xs text-gray-400">{app.unit}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500">Rent</p>
                    <p className="font-semibold text-gray-900">TZS {app.rent.toLocaleString()}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500">Move-in</p>
                    <p className="font-medium text-gray-900">
                      {new Date(app.moveInDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {app.status === 'pending' && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-1">
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View Details</DropdownMenuItem>
                      <DropdownMenuItem><FileText className="h-4 w-4 mr-2" />View Documents</DropdownMenuItem>
                      <DropdownMenuItem><Phone className="h-4 w-4 mr-2" />Call Applicant</DropdownMenuItem>
                      <DropdownMenuItem><Mail className="h-4 w-4 mr-2" />Send Email</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><User className="h-4 w-4 mr-2" />Run Background Check</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </RentalManagerLayout>
  );
};

export default Applications;
