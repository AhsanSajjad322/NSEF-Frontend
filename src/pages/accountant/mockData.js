

// Mock data for the dashboard
export const dashboardData = {
  currentBalance: 2500000, 
  totalGrantedCases: 142,
  pendingCases: 23,
  incomingCash: 375000,
  recentlyApprovedCases: 7
};

// Mock data for pending fund requests
export const pendingRequests = [
  { id: 1, studentName: 'Ahsan Sajjad', cms: '368857', requestAmount: 15000, requestDate: '2025-05-29', reason: 'Tuition fee assistance', status: 'pending', approvedByNSFT: true },
  { id: 2, studentName: 'Nadir Shahbaz', cms: '368858', requestAmount: 25000, requestDate: '2025-05-28', reason: 'Hostel fee assistance', status: 'pending', approvedByNSFT: true },
  { id: 3, studentName: 'Taha Ahmed', cms: '368859', requestAmount: 10000, requestDate: '2025-05-27', reason: 'Course materials', status: 'pending', approvedByNSFT: false },
  { id: 4, studentName: 'Sara Khan', cms: '368860', requestAmount: 30000, requestDate: '2025-05-27', reason: 'Semester fee support', status: 'pending', approvedByNSFT: true },
  { id: 5, studentName: 'Bilal Akram', cms: '368861', requestAmount: 12000, requestDate: '2025-05-26', reason: 'Project materials', status: 'pending', approvedByNSFT: false }
];

// Mock data for incoming cash transactions from NSFT
export const incomingCashTransactions = [
  { id: 101, nsftMember: 'Usman Ali', amount: 150000, date: '2025-06-04', source: 'Alumni Donations', status: 'pending' },
  { id: 102, nsftMember: 'Fatima Zahra', amount: 125000, date: '2025-06-03', source: 'Corporate Sponsorship', status: 'pending' },
  { id: 103, nsftMember: 'Hassan Raza', amount: 100000, date: '2025-06-02', source: 'Fundraising Event', status: 'pending' }
];

// Mock data for recent activity
export const recentActivity = [
  { id: 201, type: 'grant', details: 'Approved PKR 18,000 for Abdullah Khan', date: '2025-06-04', icon: 'CheckCircle' },
  { id: 202, type: 'deposit', details: 'Received PKR 200,000 from NSFT', date: '2025-06-03', icon: 'ArrowDownCircle' },
  { id: 203, type: 'reject', details: 'Rejected request from Sana Malik', date: '2025-06-02', icon: 'XCircle' },
  { id: 204, type: 'grant', details: 'Approved PKR 30,000 for Hamza Ali', date: '2025-06-01', icon: 'CheckCircle' },
  { id: 205, type: 'deposit', details: 'Received PKR 175,000 from NSFT', date: '2025-05-31', icon: 'ArrowDownCircle' }
];
