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
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';
import { X } from 'lucide-react';

const itemsPerPage = 5; // Adjust as needed

const CRCashHandoversPage = () => {
  const [unprocessedTransactions, setUnprocessedTransactions] = useState([
    { id: 2, name: 'Sara Khan', cms: '368853', amount: 10000, date: '2025-03-05', status: 'unprocessed' },
    { id: 4, name: 'Ayesha Siddiqui', cms: '368157', amount: 5000, date: '2025-03-12', status: 'unprocessed' },
    { id: 7, name: 'Hamza Khan', cms: '368856', amount: 12000, date: '2025-03-02', status: 'unprocessed' },
    { id: 9, name: 'Qasim Shah', cms: '362857', amount: 9000, date: '2025-03-11', status: 'unprocessed' },
    { id: 11, name: 'Tahir Mehmood', cms: '168857', amount: 6000, date: '2025-04-01', status: 'unprocessed' },
    { id: 13, name: 'Waqas Ali', cms: '568857', amount: 11000, date: '2025-04-05', status: 'unprocessed' },
    { id: 14, name: 'Zainab Fatima', cms: '248439', amount: 9500, date: '2025-04-10', status: 'unprocessed' },
    { id: 15, name: 'Yaseen Khan', cms: '238539', amount: 7000, date: '2025-04-15', status: 'unprocessed' },
  ]);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [totalSelectedAmount, setTotalSelectedAmount] = useState(0);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [handoverRecipients] = useState(['Recipient A', 'Recipient B', 'Recipient C', 'Recipient D', 'Recipient E', 'Recipient F']);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let total = 0;
    unprocessedTransactions.forEach(transaction => {
      if (selectedTransactionIds.has(transaction.id)) {
        total += transaction.amount;
      }
    });
    setTotalSelectedAmount(total);
  }, [selectedTransactionIds, unprocessedTransactions]);

  useEffect(() => {
    if (selectAll) {
      const allIds = new Set(unprocessedTransactions.map(transaction => transaction.id));
      setSelectedTransactionIds(allIds);
    } else {
      setSelectedTransactionIds(new Set());
    }
  }, [selectAll, unprocessedTransactions]);

  const handleTransactionSelect = (id) => {
    const newSelectedIds = new Set(selectedTransactionIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedTransactionIds(newSelectedIds);
    setSelectAll(newSelectedIds.size === unprocessedTransactions.length && unprocessedTransactions.length > 0);
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
  };

  const openHandoverModal = () => {
    if (selectedTransactionIds.size > 0) {
      setIsHandoverModalOpen(true);
    } else {
      alert('Please select transactions to handover.');
    }
  };

  const closeHandoverModal = () => {
    setIsHandoverModalOpen(false);
    setSelectedRecipient('');
  };

  const handleRecipientChange = (event) => {
    setSelectedRecipient(event.target.value);
  };

  const handleHandover = () => {
    if (selectedRecipient) {
      const updatedTransactions = unprocessedTransactions.map(transaction => {
        if (selectedTransactionIds.has(transaction.id)) {
          return { ...transaction, status: 'processing' };
        }
        return transaction;
      });
      setUnprocessedTransactions(updatedTransactions);
      setSelectedTransactionIds(new Set());
      setSelectAll(false);
      setTotalSelectedAmount(0);
      closeHandoverModal();
      // In a real application, you would likely make an API call here
    } else {
      alert('Please select a recipient to handover the cash to.');
    }
  };

  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = unprocessedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const totalPages = Math.ceil(unprocessedTransactions.length / itemsPerPage);

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
          CR / <span className="font-semibold text-text-DEFAULT">Cash Handovers</span>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-text-DEFAULT">Unprocessed Transactions</h2>
          <p className="text-text-DEFAULT">Total Selected Amount: <span className="font-semibold">{totalSelectedAmount}</span></p>
        </div>

        {/* Transactions List */}
        <Card className="shadow-sm border border-muted-DEFAULT">
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>CMS</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Month</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="w-10">
                      <Checkbox
                        checked={selectedTransactionIds.has(transaction.id)}
                        onCheckedChange={() => handleTransactionSelect(transaction.id)}
                      />
                    </TableCell>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell>{transaction.cms}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{format(new Date(transaction.date), 'MMMM')}</TableCell>
                  </TableRow>
                ))}
                {currentTransactions.length === 0 && unprocessedTransactions.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">No transactions found on this page.</TableCell>
                  </TableRow>
                )}
                {unprocessedTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">No unprocessed transactions found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {unprocessedTransactions.length > itemsPerPage && (
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

            {unprocessedTransactions.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button className='bg-primary-800 flex justify-start' onClick={openHandoverModal}>Handover</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Handover Modal */}
        {isHandoverModalOpen && (
          <div className="fixed px-3 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg w-full max-w-md">
              <div className="p-4 border-b border-muted-DEFAULT flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-DEFAULT">Confirm Handover</h2>
                <Button variant="ghost" size="icon" onClick={closeHandoverModal} className="text-text-light hover:bg-muted-DEFAULT">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <p className="text-text-DEFAULT mb-4">
                  Total Amount to Handover: <span className="font-semibold">{totalSelectedAmount}</span>
                </p>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="handover-to" className="text-text-DEFAULT">Handover To</Label>
                    <select
                      id="handover-to"
                      className="rounded-md border border-muted-DEFAULT shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-text-DEFAULT dark:bg-background-DEFAULT dark:border-muted-DEFAULT dark:text-text-DEFAULT handover-recipient-dropdown"
                      value={selectedRecipient}
                      onChange={handleRecipientChange}
                      style={{ width: '200px', maxWidth: '100%' }}
                    >
                      <option value="">Select Recipient</option>
                      {handoverRecipients.map((recipient) => (
                        <option key={recipient} value={recipient}>{recipient}</option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={handleHandover} className="bg-primary-500 text-white hover:bg-primary-600">
                    Handover
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CRCashHandoversPage;