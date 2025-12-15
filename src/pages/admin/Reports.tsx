/**
 * Admin Reports Page
 * Generate and download reports
 */

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileText, Download, Calendar as CalendarIcon, 
  TrendingUp, Users, Home, DollarSign, Clock, CheckCircle, Loader2
} from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  useGeneratedReports,
  useReportStatistics,
  usePopularReports,
  useGenerateReport,
  useDownloadReport,
} from '@/hooks/useAdminReports';

const reportTemplates = [
  {
    id: 'financial',
    name: 'Financial Report',
    description: 'Revenue, expenses, and profit analysis',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 'user_activity',
    name: 'User Activity Report',
    description: 'User registrations, engagement, and retention',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 'property_performance',
    name: 'Property Performance',
    description: 'Property listings, bookings, and ratings',
    icon: Home,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    id: 'booking_summary',
    name: 'Booking Summary',
    description: 'Booking trends, cancellations, and revenue',
    icon: CalendarIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    id: 'platform_analytics',
    name: 'Platform Analytics',
    description: 'Overall platform health and metrics',
    icon: TrendingUp,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
];

export default function AdminReports() {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [format, setFormat] = useState('pdf');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [downloadingReportId, setDownloadingReportId] = useState<string | null>(null);

  // Fetch data
  const { data: generatedReports = [], isLoading: reportsLoading } = useGeneratedReports();
  const { data: statistics } = useReportStatistics();
  const { data: popularReports = [] } = usePopularReports();
  
  // Mutations
  const generateReport = useGenerateReport();
  const downloadReport = useDownloadReport();

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      toast.error('Please select a report type');
      return;
    }

    try {
      await generateReport.mutateAsync({
        reportType: selectedReport,
        dateRange,
        format,
        startDate,
        endDate,
      });

      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const handleDownload = async (reportId: string, reportName: string) => {
    try {
      setDownloadingReportId(reportId);
      await downloadReport.mutateAsync(reportId);
      toast.success(`Downloaded ${reportName}`);
    } catch (error) {
      toast.error('Failed to download report');
    } finally {
      setDownloadingReportId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and download platform reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Generation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Generate New Report</CardTitle>
                <CardDescription>Select a report template to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {reportTemplates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => setSelectedReport(template.id)}
                        className={cn(
                          "flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left",
                          selectedReport === template.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className={cn("p-2 rounded-lg", template.bgColor)}>
                          <Icon className={cn("h-5 w-5", template.color)} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-500 mt-1">{template.description}</div>
                        </div>
                        {selectedReport === template.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Report Configuration */}
                {selectedReport && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date Range</Label>
                        <Select value={dateRange} onValueChange={setDateRange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="last_7_days">Last 7 days</SelectItem>
                            <SelectItem value="last_30_days">Last 30 days</SelectItem>
                            <SelectItem value="last_3_months">Last 3 months</SelectItem>
                            <SelectItem value="last_6_months">Last 6 months</SelectItem>
                            <SelectItem value="last_year">Last year</SelectItem>
                            <SelectItem value="custom">Custom range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Export Format</Label>
                        <Select value={format} onValueChange={setFormat}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {dateRange === 'custom' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !startDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? formatDate(startDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !endDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {endDate ? formatDate(endDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={handleGenerateReport} 
                      className="w-full" 
                      size="lg"
                      disabled={generateReport.isPending}
                    >
                      {generateReport.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Previously generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                {reportsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : generatedReports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No reports generated yet</p>
                    <p className="text-sm mt-1">Generate your first report above</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {generatedReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 bg-white rounded-lg">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{report.name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                              <span>{report.dateRange}</span>
                              <span>•</span>
                              <span>{report.size}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {report.format}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(report.id, report.name)}
                          disabled={downloadingReportId === report.id}
                        >
                          {downloadingReportId === report.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Total Reports</span>
                  </div>
                  <span className="font-bold">{statistics?.totalReports || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">This Month</span>
                  </div>
                  <span className="font-bold">{statistics?.reportsThisMonth || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Downloads</span>
                  </div>
                  <span className="font-bold">{statistics?.totalDownloads || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularReports.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No data available yet
                  </p>
                ) : (
                  popularReports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{report.name}</span>
                      <Badge variant="secondary">{report.count}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Schedule reports to run automatically</p>
                <p>• Export to Excel for detailed analysis</p>
                <p>• Use custom date ranges for specific periods</p>
                <p>• Share reports with team members</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
