import React, { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Notification from '@/components/home/Notification';
import DashboardTabs from './components/DashboardTabs';
import GrantFundModal from './components/GrantFundModal';
import { formatCurrency } from './utils';
import { dashboardData, incomingCashTransactions, recentActivity } from './mockData';
import { fundRequestService } from '@/lib/api-client';
import { useToast } from '@/components/ui/use-toast';

const AccountantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);  const [grantAmount, setGrantAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleGrantFund = (request) => {
    setSelectedRequest(request);
    // Set the initial amount to the requested amount
    setGrantAmount(request.amount ? request.amount.toString() : '0');
    setIsModalOpen(true);
  };
  
  // Handle approving a fund request
  const handleApproveRequest = async () => {
    if (!selectedRequest || !grantAmount) {
      toast.error('Invalid request data', {
        description: 'Please ensure all fields are filled correctly.'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const amountValue = parseFloat(grantAmount);
      
      // Transfer details would normally be collected from a form
      // For this implementation, we're just creating a simple object
      const transferDetails = {
        method: 'Bank Transfer',
        transferDate: new Date().toISOString().split('T')[0],
        reference: `NSEF-TRF-${Date.now().toString().substr(-6)}`,
        accountantId: 'ACC-2025-001'
      };
      
      const response = await fundRequestService.grantFundRequest(
        selectedRequest.id, 
        amountValue,
        transferDetails
      );
      
      if (response.success) {
        toast.success('Fund granted successfully', {
          description: `${formatCurrency(amountValue)} has been granted to ${selectedRequest.studentName}.`
        });
        
        // Close the modal and reset state
        setIsModalOpen(false);
        setSelectedRequest(null);
        setGrantAmount('');
      } else {
        toast.error('Failed to grant fund', {
          description: response.message || 'An error occurred. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error granting fund:', error);
      toast.error('Failed to grant fund', {
        description: 'An unexpected error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRejectRequest = async (request) => {
    if (!request) return;
    
    if (!window.confirm(`Are you sure you want to reject the fund request from ${request.studentName}?`)) {
      return;
    }
    
    try {
      // For this implementation, we're using a simple rejection reason
      const rejectionReason = 'Fund request rejected by accountant due to policy constraints';
      
      const response = await fundRequestService.rejectFundRequest(
        request.id, 
        rejectionReason
      );
      
      if (response.success) {
        toast.success('Request rejected', {
          description: `You have rejected ${request.studentName}'s request.`
        });
      } else {
        toast.error('Failed to reject request', {
          description: response.message || 'An error occurred. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request', {
        description: 'An unexpected error occurred. Please try again later.'
      });
    }
  };
  
  const handleApproveIncomingCash = (transaction) => {
    console.log(`Approved incoming cash #${transaction.id} with amount: ${transaction.amount}`);
    
    alert(`Incoming cash approved: ${formatCurrency(transaction.amount)}`);
  };

  return (
    <div className="bg-background-DEFAULT min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        {/* Breadcrumb */}
        <div className="text-sm text-text-light mb-4">
          Accountant / <span className="font-semibold text-text-DEFAULT">Dashboard</span>
        </div>
          {/* Accountant Details Section */}
        <div className="bg-primary-800 text-white p-4 rounded-md shadow-sm mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold">Muhammad Kashif</p>
              <p className="text-sm">Accountant</p>
            </div>
            <p className="text-sm bg-primary-700 px-3 py-1 rounded-md">NSEF Funds Management</p>
          </div>
        </div>
        
        <Notification message="Welcome to the Accountant Dashboard! You have 23 pending fund requests to review." type="info" />
        
        {/* Dashboard Tabs */}
        <DashboardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          dashboardData={dashboardData}
          recentActivity={recentActivity}
          incomingCashTransactions={incomingCashTransactions}
          handleGrantFund={handleGrantFund}
          handleRejectRequest={handleRejectRequest}
          handleApproveIncomingCash={handleApproveIncomingCash}
        />
          
          {/* Overview Tab Content */}          {/* Grant Fund Modal */}
        <GrantFundModal
          isOpen={isModalOpen}
          selectedRequest={selectedRequest}
          grantAmount={grantAmount}
          setGrantAmount={setGrantAmount}
          onClose={() => setIsModalOpen(false)}
          onApprove={handleApproveRequest}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AccountantDashboard;