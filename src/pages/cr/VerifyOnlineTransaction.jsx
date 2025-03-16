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

const itemsPerPage = 8;

const VerifyOnlineTransactionPage = () => {
  const [onlineTransactions, setOnlineTransactions] = useState([
    { id: 1, name: 'Ali Ahmed', cms: '3148194', amount: 25000, date: new Date('2025-03-10'), status: 'Verified', receiptUrl: '/receipt1.pdf' },
    { id: 2, name: 'Sara Khan', cms: '3743194', amount: 15000, date: new Date('2025-03-12'), status: 'Pending', receiptUrl: '/receipt2.pdf' },
    { id: 3, name: 'Usman Ghani', cms: '3743194', amount: 30000, date: new Date('2025-03-05'), status: 'Verified', receiptUrl: '/receipt3.pdf' },
    { id: 4, name: 'Ayesha Siddiqui', cms: '3748144', amount: 10000, date: new Date('2025-03-15'), status: 'Pending', receiptUrl: '/receipt4.pdf' },
    { id: 5, name: 'Bilal Raza', cms: '1748194', amount: 28000, date: new Date('2025-03-08'), status: 'Verified', receiptUrl: '/receipt5.pdf' },
    { id: 6, name: 'Fatima Ali', cms: '2748194', amount: 22000, date: new Date('2025-03-11'), status: 'Pending', receiptUrl: '/receipt6.pdf' },
    { id: 7, name: 'Hamza Khan', cms: '3748194', amount: 18000, date: new Date('2025-03-14'), status: 'Verified', receiptUrl: '/receipt7.pdf' },
    { id: 8, name: 'Nimra Butt', cms: '4748194', amount: 32000, date: new Date('2025-03-07'), status: 'Pending', receiptUrl: '/receipt8.pdf' },
    { id: 9, name: 'Qasim Shah', cms: '5748194', amount: 26000, date: new Date('2025-03-13'), status: 'Verified', receiptUrl: '/receipt9.pdf' },
    { id: 10, name: 'Sana Javed', cms: '6748194', amount: 29000, date: new Date('2025-03-09'), status: 'Pending', receiptUrl: '/receipt10.pdf' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState(null);
  const [editedAmount, setEditedAmount] = useState('');
  const [isWrongAccount, setIsWrongAccount] = useState(false);
  const [wrongAccountDetails, setWrongAccountDetails] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
    setIsViewModalOpen(true);
    setIsWrongAccount(false);
    setWrongAccountDetails('');
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingTransaction(null);
    setEditedAmount('');
    setIsWrongAccount(false);
    setWrongAccountDetails('');
  };

  const handleEditAmountChange = (event) => {
    setEditedAmount(event.target.value);
  };

  const handleWrongAccountChange = (event) => {
    setIsWrongAccount(event.target.checked);
  };

  const handleWrongAccountDetailsChange = (event) => {
    setWrongAccountDetails(event.target.value);
  };

  const handleVerifyTransaction = () => {
    if (viewingTransaction && !isWrongAccount && viewingTransaction.status === 'Pending') {
      const updatedTransactions = onlineTransactions.map(transaction =>
        transaction.id === viewingTransaction.id ? { ...transaction, status: 'Verified', amount: parseFloat(editedAmount) } : transaction
      );
      setOnlineTransactions(updatedTransactions);
      closeViewModal();
    }
  };

  const handleDiscardTransaction = () => {
    // Implement logic to handle discarded/rejected transaction
    if (viewingTransaction && viewingTransaction.status === 'Pending' && isWrongAccount) {
      console.log('Transaction Discarded:', viewingTransaction, wrongAccountDetails);
      closeViewModal();
    }
  };

  const filteredAndSortedTransactions = onlineTransactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.name.toLowerCase().includes(searchLower) ||
      transaction.cms.toLowerCase().includes(searchLower)
    );
  }).filter(transaction => {
    if (filterStatus === 'all') return true;
    return transaction.status.toLowerCase() === filterStatus;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
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
                {/* Add other sorting options if needed */}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Label className="text-text-DEFAULT">Filter By:</Label>
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('all')}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'verified' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('verified')}
            >
              Verified
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('pending')}
            >
              Pending
            </Button>
          </div>
        </div>

        {/* Online Transactions List */}
        <Card className="shadow-sm border border-muted-DEFAULT">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-text-DEFAULT">Online Transactions</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>CMS</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell>{transaction.cms}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString('en-US', { month: 'short' })}</TableCell>
                    <TableCell className={transaction.status === 'Verified' ? 'text-green-500' : 'text-yellow-500'}>{transaction.status}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="icon" onClick={() => openViewModal(transaction)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {currentTransactions.length === 0 && filteredAndSortedTransactions.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">No transactions found on this page.</TableCell>
                  </TableRow>
                )}
                {filteredAndSortedTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">No transactions match your search criteria.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

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
                  {/* Placeholder for Receipt Display - Replace with actual receipt display */}
                  <div className="border border-muted-DEFAULT rounded-md p-2 text-sm text-text-light">
                    <p>Receipt Preview (Replace with actual image/content)</p>
                    <p>Transaction ID: {viewingTransaction.id}</p>
                    <p>Date: {viewingTransaction.date.toLocaleDateString()}</p>
                    {/* You would typically display an image or embed a PDF here */}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-amount" className="text-text-DEFAULT">Amount</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={editedAmount}
                    onChange={handleEditAmountChange}
                    readOnly={viewingTransaction.status === 'Verified'}
                  />
                </div>
                {viewingTransaction.status === 'Pending' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="wrong-account"
                        type="checkbox"
                        checked={isWrongAccount}
                        onChange={handleWrongAccountChange}
                      />
                      <Label htmlFor="wrong-account" className="text-text-DEFAULT cursor-pointer">Wrong Account Transaction</Label>
                    </div>
                    {isWrongAccount && (
                      <div className="grid gap-2">
                        <Label htmlFor="wrong-account-details" className="text-text-DEFAULT">Details</Label>
                        <Textarea
                          id="wrong-account-details"
                          placeholder="Enter details of the wrong transaction"
                          value={wrongAccountDetails}
                          onChange={handleWrongAccountDetailsChange}
                          rows={3}
                          required={isWrongAccount}
                        />
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-end space-x-2">
                  <Button onClick={closeViewModal}>Close</Button>
                  {viewingTransaction.status === 'Pending' && (
                    <>
                      {isWrongAccount ? (
                        <Button variant="destructive" onClick={handleDiscardTransaction}>Discard</Button>
                      ) : (
                        <Button onClick={handleVerifyTransaction} className="bg-primary-500 text-white hover:bg-primary-600">
                          Verify
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyOnlineTransactionPage;