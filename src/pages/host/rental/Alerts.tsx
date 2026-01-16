/**
 * ALERTS PAGE - Rental alerts and notifications
 */

import React, { useState } from 'react';
import RentalManagerLayout from '@/components/host/rental/RentalManagerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, AlertTriangle, Clock, DollarSign, FileText, 
  Wrench, Calendar, CheckCircle2, X, Settings
} from 'lucide-react';

type AlertType = 'payment' | 'lease' | 'maintenance' | 'application' | 'general';
type AlertPriority = 'high' | 'medium' | 'low';

inter