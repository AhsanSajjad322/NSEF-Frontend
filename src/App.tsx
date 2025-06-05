import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import DashboardPage from './pages/student/Dashboard';
import DonateOnlinePage from './pages/student/DonateOnline';
import TransactionsPage from './pages/student/Transactions';
import RequestFundPage from './pages/student/RequestFund';
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedUserType="Student">
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/student/donate-online" element={
            <ProtectedRoute allowedUserType="Student">
              <DonateOnlinePage />
            </ProtectedRoute>
          } />
          <Route path="/student/view-transactions" element={
            <ProtectedRoute allowedUserType="Student">
              <TransactionsPage />
            </ProtectedRoute>
          } />
          <Route path="/student/request-fund" element={
            <ProtectedRoute allowedUserType="Student">
              <RequestFundPage />
            </ProtectedRoute>
          } />
          <Route path="/student/complaint" element={
            <ProtectedRoute allowedUserType="Student">
              <ComplaintPage />
            </ProtectedRoute>
          } />

          {/* CR Routes */}
          <Route path="/cr/dashboard" element={
            <ProtectedRoute allowedUserType="CR">
              <CRDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/cr/add-donation" element={
            <ProtectedRoute allowedUserType="CR">
              <AddDonationPage />
            </ProtectedRoute>
          } />
          <Route path="/cr/transactions" element={
            <ProtectedRoute allowedUserType="CR">
              <CRTransactionsPage />
            </ProtectedRoute>
          } />
          <Route path="/cr/verify-online-transaction" element={
            <ProtectedRoute allowedUserType="CR">
              <VerifyOnlineTransactionPage />
            </ProtectedRoute>
          } />
          <Route path="/cr/cash-handovers" element={
            <ProtectedRoute allowedUserType="CR">
              <CRCashHandoversPage />
            </ProtectedRoute>
          } />

          {/* BP Routes */}
          <Route path="/bp/dashboard" element={
            <ProtectedRoute allowedUserType="BP">
              <BPDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/bp/cash-handovers" element={
            <ProtectedRoute allowedUserType="BP">
              <BPCashHandoversPage />
            </ProtectedRoute>
          } />
          <Route path="/bp/cash-receival-confirmation" element={
            <ProtectedRoute allowedUserType="BP">
              <BPCashReceivalConfirmationPage />
            </ProtectedRoute>
          } />

          {/* NSFT Routes */}
          <Route path="/nsft/dashboard" element={
            <ProtectedRoute allowedUserType="NSFT">
              <NSFTDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/nsft/cash-receival-confirmation" element={
            <ProtectedRoute allowedUserType="NSFT">
              <NSFTCashReceivalConfirmationPage />
            </ProtectedRoute>
          } />

          {/* Redirect root to login */}
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;