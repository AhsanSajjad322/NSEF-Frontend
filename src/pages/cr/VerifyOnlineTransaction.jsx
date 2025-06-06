import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Search, Check, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getToken } from '@/utils/auth';

const itemsPerPage = 8;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const VerifyOnlineTransactionPage = () => {
  const [onlineTransactions, setOnlineTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState(null);
  const [editedAmount, setEditedAmount] = useState('');
  const [rejectionDetails, setRejectionDetails] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setError('Authentication token not found.');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/fund_tracking/transactions/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching transactions: ${response.statusText}`);
      }

      const data = await response.json();
      // Filter only online transactions
      const online = data.filter(transaction => transaction.mode === 'online');
      setOnlineTransactions(online);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSortByChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const openViewModal = (transaction) => {
    setViewingTransaction(transaction);
    setEditedAmount(transaction.amount.toString());
    setRejectionDetails('');
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingTransaction(null);
    setEditedAmount('');
    setRejectionDetails('');
  };

  const handleEditAmountChange = (event) => {
    setEditedAmount(event.target.value);
  };

  const handleRejectionDetailsChange = (event) => {
    setRejectionDetails(event.target.value);
  };

  const handleVerifyTransaction = async () => {
    if (!viewingTransaction) return;

    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setError('Authentication token not found.');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/fund_tracking/transactions/${viewingTransaction.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(editedAmount),
          verification_state: 'verified'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify transaction');
      }

      await fetchTransactions();
      closeViewModal();
    } catch (err) {
      setError(err.message);
      console.error('Failed to verify transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectTransaction = async () => {
    if (!viewingTransaction || !rejectionDetails) {
      alert('Please provide rejection details');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setError('Authentication token not found.');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/fund_tracking/transactions/${viewingTransaction.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          verification_state: 'rejected',
          rejection_details: rejectionDetails
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject transaction');
      }

      await fetchTransactions();
      closeViewModal();
    } catch (err) {
      setError(err.message);
      console.error('Failed to reject transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusDisplay = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredAndSortedTransactions = onlineTransactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    const studentName = `${transaction.sender.user.first_name} ${transaction.sender.user.last_name}`.toLowerCase();
    return (
      studentName.includes(searchLower) ||
      transaction.sender.cms.toString().toLowerCase().includes(searchLower)
    );
  }).filter(transaction => {
    if (filterStatus === 'all') return true;
    return transaction.verification_state === filterStatus;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    }
    return 0;
  });

  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = filteredAndSortedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage(prev => prev < totalPages ? prev + 1 : prev);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => prev > 1 ? prev - 1 : prev);
  };

  return (
    <div className="bg-background-DEFAULT min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        {/* Breadcrumb */}
        <div className="text-sm text-text-light mb-4">
          CR / <span className="font-semibold text-text-DEFAULT">Verify Online Transactions</span>
        </div>

        {/* Search, Sort, and Filters */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by Name or CMS"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute top-2.5 right-3 h-4 w-4 text-text-light" />
          </div>
          <div>
            <Label htmlFor="sort-by" className="text-text-DEFAULT block mb-1">Sort By:</Label>
            <Select value={sortBy} onValueChange={handleSortByChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter-status" className="text-text-DEFAULT block mb-1">Filter Status:</Label>
            <Select value={filterStatus} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Online Transactions List */}
        <Card className="shadow-sm border border-muted-DEFAULT">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-text-DEFAULT">Online Transactions</h2>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>CMS</TableHead>
                  <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                      <TableCell>{`${transaction.sender.user.first_name} ${transaction.sender.user.last_name}`}</TableCell>
                      <TableCell>{transaction.sender.cms}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{new Date(transaction.created).toLocaleDateString()}</TableCell>
                      <TableCell className={getStatusColor(transaction.verification_state)}>
                        {getStatusDisplay(transaction.verification_state)}
                      </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="icon" onClick={() => openViewModal(transaction)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {currentTransactions.length === 0 && filteredAndSortedTransactions.length > 0 && (
                  <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">No transactions found on this page.</TableCell>
                  </TableRow>
                )}
                {filteredAndSortedTransactions.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">No transactions match your search criteria.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            )}

            {filteredAndSortedTransactions.length > itemsPerPage && (
              <div className="flex justify-between items-center mt-4">
                <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                  Previous
                </Button>
                <span>{currentPage} of {totalPages}</span>
                <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Transaction Modal */}
        {isViewModalOpen && viewingTransaction && (
          <div className="fixed px-3 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg w-full max-w-md">
              <div className="p-4 border-b border-muted-DEFAULT flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-DEFAULT">Transaction Details</h2>
                <Button variant="ghost" size="icon" onClick={closeViewModal} className="text-text-light hover:bg-muted-DEFAULT">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 grid gap-4">
                <div>
                  <Label htmlFor="receipt" className="text-text-DEFAULT block mb-1">Receipt</Label>
                  <div className="border border-muted-DEFAULT rounded-md p-2 text-sm text-text-light">
                    <p>Receipt Preview (Replace with actual image/content)</p>
                    <p>Transaction ID: {viewingTransaction.id}</p>
                    <p>Date: {new Date(viewingTransaction.created).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-amount" className="text-text-DEFAULT">Amount</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={editedAmount}
                    onChange={handleEditAmountChange}
                    readOnly={viewingTransaction.verification_state !== 'pending'}
                  />
                </div>
                {viewingTransaction.verification_state === 'pending' && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="rejection-details" className="text-text-DEFAULT">Rejection Details</Label>
                      <Textarea
                        id="rejection-details"
                        placeholder="Enter rejection details"
                        value={rejectionDetails}
                        onChange={handleRejectionDetailsChange}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="destructive" onClick={handleRejectTransaction}>
                        Reject
                      </Button>
                      <Button onClick={handleVerifyTransaction} className="bg-primary-500 text-white hover:bg-primary-600">
                        Verify
                      </Button>
                      </div>
                  </>
                )}
                {viewingTransaction.verification_state === 'rejected' && (
                  <div className="grid gap-2">
                    <Label className="text-text-DEFAULT">Rejection Details</Label>
                    <div className="p-2 bg-red-50 text-red-700 rounded-md">
                      {viewingTransaction.rejection_details}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyOnlineTransactionPage;