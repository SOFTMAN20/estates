/**
 * Admin Reports Hook
 * Manages report generation and fetching for admin reports page
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';

export interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  dateRange: string;
  format: string;
  size: string;
  generatedAt: string;
  status: 'completed' | 'processing' | 'failed';
  startDate?: string;
  endDate?: string;
}

interface ReportStatistics {
  totalReports: number;
  reportsThisMonth: number;
  totalDownloads: number;
}

interface PopularReport {
  type: string;
  name: string;
  count: number;
}

/**
 * Fetch generated reports
 */
export function useGeneratedReports() {
  return useQuery({
    queryKey: ['admin', 'reports', 'generated'],
    queryFn: async (): Promise<GeneratedReport[]> => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('generated_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch report statistics
 */
export function useReportStatistics() {
  return useQuery({
    queryKey: ['admin', 'reports', 'statistics'],
    queryFn: async (): Promise<ReportStatistics> => {
      const { data: reports, error } = await supabase
        .from('reports')
        .select('download_count, created_at');
      
      if (error) {
        console.error('Error fetching report statistics:', error);
        throw error;
      }

      const totalReports = reports?.length || 0;
      
      // Calculate reports this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const reportsThisMonth = reports?.filter(r => 
        new Date(r.created_at) >= startOfMonth
      ).length || 0;

      // Calculate total downloads
      const totalDownloads = reports?.reduce((sum, r) => sum + (r.download_count || 0), 0) || 0;
      
      return {
        totalReports,
        reportsThisMonth,
        totalDownloads,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch popular reports
 */
export function usePopularReports() {
  return useQuery({
    queryKey: ['admin', 'reports', 'popular'],
    queryFn: async (): Promise<PopularReport[]> => {
      const { data: reports, error } = await supabase
        .from('reports')
        .select('type, name, download_count');
      
      if (error) {
        console.error('Error fetching popular reports:', error);
        throw error;
      }

      // Group by type and sum downloads
      const typeMap: Record<string, { name: string; count: number }> = {};
      
      reports?.forEach(report => {
        if (!typeMap[report.type]) {
          typeMap[report.type] = { name: report.name.split(' - ')[0], count: 0 };
        }
        typeMap[report.type].count += report.download_count || 0;
      });

      // Convert to array and sort by count
      return Object.entries(typeMap)
        .map(([type, data]) => ({
          type,
          name: data.name,
          count: data.count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4); // Top 4
    },
    staleTime: 5 * 60 * 1000,
  });
}

interface GenerateReportParams {
  reportType: string;
  dateRange: string;
  format: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Generate a new report
 */
export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: GenerateReportParams) => {
      // Calculate date range
      let startDate = params.startDate;
      let endDate = params.endDate;
      
      if (params.dateRange !== 'custom') {
        endDate = new Date();
        startDate = new Date();
        
        switch (params.dateRange) {
          case 'last_7_days':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case 'last_30_days':
            startDate.setDate(startDate.getDate() - 30);
            break;
          case 'last_3_months':
            startDate.setMonth(startDate.getMonth() - 3);
            break;
          case 'last_6_months':
            startDate.setMonth(startDate.getMonth() - 6);
            break;
          case 'last_year':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        }
      }

      if (!startDate || !endDate) {
        throw new Error('Invalid date range');
      }

      // Generate report data
      const reportData = await generateReportData(params.reportType, startDate, endDate);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create report name
      const reportNames: Record<string, string> = {
        financial: 'Financial Report',
        user_activity: 'User Activity Report',
        property_performance: 'Property Performance',
        booking_summary: 'Booking Summary',
        platform_analytics: 'Platform Analytics',
      };

      const reportName = `${reportNames[params.reportType]} - ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
      const dateRangeStr = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

      // Calculate approximate size
      const dataSize = JSON.stringify(reportData).length;
      const sizeKB = Math.round(dataSize / 1024);
      const size = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

      // Insert report into database
      const { data, error } = await supabase
        .from('reports')
        .insert({
          name: reportName,
          type: params.reportType,
          date_range: dateRangeStr,
          format: params.format.toUpperCase(),
          size,
          status: 'completed',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          generated_by: user.id,
          report_data: reportData,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Report generated successfully',
        report: data,
      };
    },
    onSuccess: () => {
      // Invalidate reports query to refetch
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
}

/**
 * Download a report
 */
export function useDownloadReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string) => {
      try {
        console.log('Starting download for report:', reportId);
        
        // Fetch report from database
        const { data: report, error } = await supabase
          .from('reports')
          .select('*')
          .eq('id', reportId)
          .single();

        if (error) {
          console.error('Error fetching report:', error);
          throw error;
        }
        if (!report) {
          console.error('Report not found');
          throw new Error('Report not found');
        }

        console.log('Report fetched:', report.name, 'Format:', report.format);

        // Dynamically import report generators
        const { generatePDFReport, generateExcelReport, generateCSVReport } = await import('@/lib/reportGenerators');

        // Generate report in the requested format
        const format = report.format.toLowerCase();
        
        console.log('Generating report in format:', format);
        
        switch (format) {
          case 'pdf':
            generatePDFReport(report.report_data, report.name, report.type);
            break;
          case 'xlsx':
            generateExcelReport(report.report_data, report.name, report.type);
            break;
          case 'csv':
            generateCSVReport(report.report_data, report.name, report.type);
            break;
          default:
            console.log('Using fallback JSON format');
            // Fallback to JSON
            const reportContent = JSON.stringify(report.report_data, null, 2);
            const blob = new Blob([reportContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${report.name}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        console.log('Report generated, updating download count');

        // Update download count
        await supabase
          .from('reports')
          .update({ download_count: (report.download_count || 0) + 1 })
          .eq('id', reportId);

        console.log('Download completed successfully');

        return {
          success: true,
          message: 'Download started',
        };
      } catch (error) {
        console.error('Download error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate queries to update download counts
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
}

/**
 * Generate report data based on type
 * This fetches the actual data that will be included in the report
 */
export async function generateReportData(
  reportType: string,
  startDate: Date,
  endDate: Date
) {
  switch (reportType) {
    case 'financial':
      return await generateFinancialReport(startDate, endDate);
    case 'user_activity':
      return await generateUserActivityReport(startDate, endDate);
    case 'property_performance':
      return await generatePropertyPerformanceReport(startDate, endDate);
    case 'booking_summary':
      return await generateBookingSummaryReport(startDate, endDate);
    case 'platform_analytics':
      return await generatePlatformAnalyticsReport(startDate, endDate);
    default:
      throw new Error('Invalid report type');
  }
}

async function generateFinancialReport(startDate: Date, endDate: Date) {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('total_amount, service_fee, created_at, status')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error) throw error;

  const totalRevenue = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
  const totalCommission = bookings?.reduce((sum, b) => sum + (b.service_fee || 0), 0) || 0;
  const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;

  return {
    totalRevenue,
    totalCommission,
    completedBookings,
    bookings,
  };
}

async function generateUserActivityReport(startDate: Date, endDate: Date) {
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, created_at, is_host')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error) throw error;

  const totalUsers = users?.length || 0;
  const newHosts = users?.filter(u => u.is_host).length || 0;
  const newGuests = totalUsers - newHosts;

  return {
    totalUsers,
    newHosts,
    newGuests,
    users,
  };
}

async function generatePropertyPerformanceReport(startDate: Date, endDate: Date) {
  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('id, title, status, created_at, property_type')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (propertiesError) throw propertiesError;

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('property_id, total_amount')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (bookingsError) throw bookingsError;

  return {
    totalProperties: properties?.length || 0,
    approvedProperties: properties?.filter(p => p.status === 'approved').length || 0,
    totalBookings: bookings?.length || 0,
    properties,
    bookings,
  };
}

async function generateBookingSummaryReport(startDate: Date, endDate: Date) {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error) throw error;

  const totalBookings = bookings?.length || 0;
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
  const cancelledBookings = bookings?.filter(b => b.status === 'cancelled').length || 0;
  const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;

  return {
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    completedBookings,
    bookings,
  };
}

async function generatePlatformAnalyticsReport(startDate: Date, endDate: Date) {
  // Fetch all relevant data
  const [usersResult, propertiesResult, bookingsResult] = await Promise.all([
    supabase.from('profiles').select('id, created_at'),
    supabase.from('properties').select('id, status, created_at'),
    supabase.from('bookings').select('id, total_amount, status, created_at'),
  ]);

  if (usersResult.error) throw usersResult.error;
  if (propertiesResult.error) throw propertiesResult.error;
  if (bookingsResult.error) throw bookingsResult.error;

  return {
    totalUsers: usersResult.data?.length || 0,
    totalProperties: propertiesResult.data?.length || 0,
    totalBookings: bookingsResult.data?.length || 0,
    totalRevenue: bookingsResult.data?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
  };
}
