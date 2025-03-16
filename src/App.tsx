import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/student/Dashboard';
import DonateOnlinePage from './pages/student/DonateOnline';
import TransactionsPage from './pages/student/Transactions';
import RequestFundPage from './pages/student/RequestFund';
import ComplaintPage from './pages/student/Complaint';
import CRDashboardPage from './pages/cr/CRDashboard';
import CRTransactionsPage from './pages/cr/CRTransactions';
import VerifyOnlineTransactionPage from './pages/cr/VerifyOnlineTransaction';
import CashHandoversPage from './pages/cr/CashHandovers';

function App() {
  return (
    <Router>
      <Routes>

        {/* Student/Personal Routes */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/student/dashboard" element={<DashboardPage />} />
        <Route path="/student" element={<DashboardPage />} />
        <Route path="/student/donate-online" element={<DonateOnlinePage />} />
        <Route path="/student/view-transactions" element={<TransactionsPage />} />
        <Route path="/student/request-fund" element={<RequestFundPage />} />
        <Route path="/student/complaint" element={<ComplaintPage />} />

        {/* CR/GR/NsfRep Routes */}
        <Route path="/cr" element={<CRDashboardPage />} />
        <Route path="/cr/dashboard" element={<CRDashboardPage />} />
        <Route path="/cr/transactions" element={<CRTransactionsPage />} />
        <Route path="/cr/verify-online-transaction" element={<VerifyOnlineTransactionPage />} />
        <Route path="/cr/cash-handovers" element={<CashHandoversPage />} />

        
        {/* <Route path="/cr/verify-online-transaction" element={<VerifyOnlineTransactionPage />} />
        <Route path="/cr/cash-handovers" element={<CashHandoversPage />} />  */}
      </Routes>
    </Router>
  );
}

export default App;