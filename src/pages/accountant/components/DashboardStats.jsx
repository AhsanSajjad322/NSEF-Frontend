import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BanknoteIcon, Users, Clock, ArrowDownCircle } from 'lucide-react';
import { formatCurrency } from '../utils';

const DashboardStats = ({ dashboardData }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Current Balance Card */}
      <Card className="bg-white">
        <CardHeader className="pb-2 xs:pb-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center flex-wrap">
            <BanknoteIcon className="h-5 w-5 text-primary-500 mr-2" />
            <span className="text-xl sm:text-2xl font-bold text-primary-800 break-all">{formatCurrency(dashboardData.currentBalance)}</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Total Granted Cases Card */}
      <Card className="bg-white">
        <CardHeader className="pb-2 xs:pb-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Granted Cases</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-secondary-500 mr-2" />
            <span className="text-xl sm:text-2xl font-bold text-secondary-800">{dashboardData.totalGrantedCases}</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Pending Cases Card */}
      <Card className="bg-white">
        <CardHeader className="pb-2 xs:pb-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Cases</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-amber-500 mr-2" />
            <span className="text-xl sm:text-2xl font-bold text-amber-600">{dashboardData.pendingCases}</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Incoming Cash Card */}
      <Card className="bg-white">
        <CardHeader className="pb-2 xs:pb-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">Incoming Cash</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center flex-wrap">
            <ArrowDownCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-xl sm:text-2xl font-bold text-green-600 break-all">{formatCurrency(dashboardData.incomingCash)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
