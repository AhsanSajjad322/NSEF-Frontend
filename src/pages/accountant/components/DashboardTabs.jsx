import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardStats from './DashboardStats';
import RecentActivity from './RecentActivity';
import FinancialSummary from './FinancialSummary';
import FundRequestsTab from './FundRequestsTab';
import IncomingCashTab from './IncomingCashTab';
import TransactionHistoryTab from './TransactionHistoryTab';

const DashboardTabs = ({
  activeTab,
  setActiveTab,
  dashboardData,
  recentActivity,
  pendingRequests,
  incomingCashTransactions,
  handleGrantFund,
  handleRejectRequest,
  handleApproveIncomingCash
}) => {  return (
    <Tabs defaultValue="overview" className="mt-6" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="flex flex-wrap mb-8 ">
        <TabsTrigger value="overview" className="flex-1 min-w-[120px]">
          Overview
        </TabsTrigger>
        <TabsTrigger value="fund-requests" className="flex-1 min-w-[120px]">
          <span className="hidden sm:inline">Fund Requests</span>
          <span className="sm:hidden">Requests</span>
        </TabsTrigger>
        <TabsTrigger value="incoming-cash" className="flex-1 min-w-[120px]">
          <span className="hidden sm:inline">Incoming Cash</span>
          <span className="sm:hidden">Cash In</span>
        </TabsTrigger>
        <TabsTrigger value="transaction-history" className="flex-1 min-w-[120px]">
          <span className="hidden sm:inline">Transaction History</span>
          <span className="sm:hidden">History</span>
        </TabsTrigger>
      </TabsList>
        {/* Overview Tab Content */}
      <TabsContent value="overview">
        <DashboardStats dashboardData={dashboardData} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecentActivity recentActivity={recentActivity} className="md:col-span-1 lg:col-span-2" />
          <FinancialSummary className="md:col-span-1" />
        </div>
      </TabsContent>
      
      {/* Fund Requests Tab Content */}
      <TabsContent value="fund-requests">
        <FundRequestsTab 
          pendingRequests={pendingRequests}
          handleGrantFund={handleGrantFund}
          handleRejectRequest={handleRejectRequest}
        />
      </TabsContent>
      
      {/* Incoming Cash Tab Content */}
      <TabsContent value="incoming-cash">
        <IncomingCashTab 
          incomingCashTransactions={incomingCashTransactions}
          handleApproveIncomingCash={handleApproveIncomingCash}
        />
      </TabsContent>
      
      {/* Transaction History Tab Content */}
      <TabsContent value="transaction-history">
        <TransactionHistoryTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
