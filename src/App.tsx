import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/student/Dashboard';
import DonateOnlinePage from './pages/student/DonateOnline';
import TransactionsPage from './pages/student/Transactions';
import RequestFundPage from './pages/student/RequestFund';
import RequestHistoryPage from './pages/student/RequestHistory';
import FundRequestDetailPage from './pages/student/FundRequestDetail';
import ComplaintPage from './pages/student/Complaint';
import CRDashboardPage from './pages/cr/CRDashboard';
import CRTransactionsPage from './pages/cr/CRTransactions';
import VerifyOnlineTransactionPage from './pages/cr/VerifyOnlineTransaction';
import CRCashHandoversPage from './pages/cr/CRCashHandovers';
import AddDonationPage from './pages/cr/AddDonation';
import BPDashboardPage from './pages/bp/BPDashboard';
import BPCashHandoversPage from './pages/bp/BPCashHandovers';
import BPCashReceivalConfirmationPage from './pages/bp/BPCashReceivalConfirmation';
import NSFTDashboardPage from './pages/nsft/NSFTDashboard';
import NSFTCashReceivalConfirmationPage from './pages/nsft/NSFTCashReceivalConfirmation';
import FundRequestsPage from './pages/nsft/FundRequests';
import AccountantDashboard from './pages/accountant/AccountantDashboard';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Router>
      <Routes>

        {/* Student/Personal Routes */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/student/dashboard" element={<DashboardPage />} />
        <Route path="/student" element={<DashboardPage />} />        <Route path="/student/donate-online" element={<DonateOnlinePage />} />
        <Route path="/student/view-transactions" element={<TransactionsPage />} />
        <Route path="/student/request-fund" element={<RequestFundPage />} />
        <Route path="/student/request-history" element={<RequestHistoryPage />} />
        <Route path="/student/fund-request/:requestId" element={<FundRequestDetailPage />} />
        <Route path="/student/complaint" element={<ComplaintPage />} />

        {/* CR/GR/NsfRep Routes */}
        <Route path="/cr" element={<CRDashboardPage />} />
        <Route path="/cr/dashboard" element={<CRDashboardPage />} />
        <Route path="cr/add-donation" element={<AddDonationPage />} />
        <Route path="/cr/transactions" element={<CRTransactionsPage />} />
        <Route path="/cr/verify-online-transaction" element={<VerifyOnlineTransactionPage />} />
        <Route path="/cr/cash-handovers" element={<CRCashHandoversPage />} />

        
        {/* BP Routes */}
        <Route path="/bp" element={<BPDashboardPage />} />
        <Route path="/bp/dashboard" element={<BPDashboardPage />} />
        <Route path="/bp/cash-handovers" element={<BPCashHandoversPage />} />
        <Route path="/bp/cash-receival-confirmation" element={<BPCashReceivalConfirmationPage />} />


        {/* NSFT Routes */}        <Route path="/nsft" element={<NSFTDashboardPage />} />
        <Route path="/nsft/dashboard" element={<NSFTDashboardPage />} />
        <Route path="/nsft/cash-receival-confirmation" element={<NSFTCashReceivalConfirmationPage />} />
        <Route path="/nsft/fund-requests" element={<FundRequestsPage />} />

        {/* Accountant Routes */}
        <Route path="/accountant" element={<AccountantDashboard />} />


      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;