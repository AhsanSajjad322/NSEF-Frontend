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
import { getToken } from '@/utils/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const itemsPerPage = 5;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CRCashHandoversPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [totalSelectedAmount, setTotalSelectedAmount] = useState(0);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [handoverRecipients, setHandoverRecipients] = useState([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipientsLoading, setRecipientsLoading] = useState(true);
  const [recipientsError, setRecipientsError] = useState(null);

  useEffect(() => {
    fetchTransactions();
    fetchRecipients();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
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
      // Filter only cash transactions with initiated state
      const initiatedCashTransactions = data.filter(transaction =>
        transaction.mode === 'cash' && transaction.state === 'initiated'
      );
      setTransactions(initiatedCashTransactions);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async () => {
    try {
      setRecipientsLoading(true);
      setRecipientsError(null);
      const token = getToken();
      if (!token) {
        setRecipientsError('Authentication token not found.');
        setRecipientsLoading(false);
        return;
      }

      const response = await fetch(`${BACKEND_URL}/base/representatives/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching representatives: ${response.statusText}`);
      }

      const data = await response.json();
      // Filter for users with group 'BP'
      const bpUsers = data.filter(representative =>
        representative.user.groups.includes('BP')
      );
      setHandoverRecipients(bpUsers);
    } catch (err) {
      setRecipientsError(err.message);
      console.error('Failed to fetch recipients:', err);
    } finally {
      setRecipientsLoading(false);
    }
  };

  useEffect(() => {
    let total = 0;
    transactions.forEach(transaction => {
      if (selectedTransactionIds.has(transaction.id)) {
        total += transaction.amount;
      }
    });
    setTotalSelectedAmount(total);
  }, [selectedTransactionIds, transactions]);

  useEffect(() => {
    if (selectAll) {
      const allIds = new Set(transactions.map(transaction => transaction.id));
      setSelectedTransactionIds(allIds);
    } else {
      setSelectedTransactionIds(new Set());
    }
  }, [selectAll, transactions]);

  const handleTransactionSelect = (id) => {
    const newSelectedIds = new Set(selectedTransactionIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedTransactionIds(newSelectedIds);
    setSelectAll(newSelectedIds.size === transactions.length && transactions.length > 0);
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
    setSelectedRecipientId('');
  };

  const handleRecipientChange = (value) => {
    setSelectedRecipientId(value);
  };

  const handleHandover = async () => {
    if (!selectedRecipientId) {
      alert('Please select a recipient to handover the cash to.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }

      const selectedIds = Array.from(selectedTransactionIds);
      const response = await fetch(`${BACKEND_URL}/fund_tracking/transactions/forward/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          transactions_ids: selectedIds,
          forwardee_id: parseInt(selectedRecipientId),
          forwarded_amount: totalSelectedAmount,
        }),
      });

      if (!response.ok) {
        const responseerror = await response.json();
        console.log(responseerror)
        console.log("Response error is above")
        throw new Error(`Failed to handover transactions: ${response.statusText}`);
      }

      await fetchTransactions();
      setSelectedTransactionIds(new Set());
      setSelectAll(false);
      setTotalSelectedAmount(0);
      closeHandoverModal();
    } catch (err) {
      setError(err.message);
      console.error('Failed to handover transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

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
            {loading ? (
              <div className="text-center py-4">Loading transactions...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>CMS</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
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
                      <TableCell>{`${transaction.sender.user.first_name} ${transaction.sender.user.last_name}`}</TableCell>
                      <TableCell>{transaction.sender.cms}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{format(new Date(transaction.created), 'MMMM dd, yyyy')}</TableCell>
                    </TableRow>
                  ))}
                  {currentTransactions.length === 0 && transactions.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">No transactions found on this page.</TableCell>
                    </TableRow>
                  )}
                  {transactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">No unprocessed transactions found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {transactions.length > itemsPerPage && (
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

            {transactions.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button
                  className='bg-primary-800 flex justify-start'
                  onClick={openHandoverModal}
                  disabled={selectedTransactionIds.size === 0}
                >
                  Handover
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Handover Modal */}
        {isHandoverModalOpen && (
          <div className="fixed px-3 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg w-full max-w-sm">
              <div className="p-4 border-b border-muted-DEFAULT flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-DEFAULT">Select Recipient</h2>
                <Button variant="ghost" size="icon" onClick={closeHandoverModal} className="text-text-light hover:bg-muted-DEFAULT">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="recipient" className="text-text-DEFAULT">Recipient (BP)</Label>
                    {recipientsLoading ? (
                      <p className="text-text-DEFAULT">Loading recipients...</p>
                    ) : recipientsError ? (
                      <p className="text-red-500">{recipientsError}</p>
                    ) : (
                       <Select onValueChange={handleRecipientChange} value={selectedRecipientId} disabled={handoverRecipients.length === 0}>
                          <SelectTrigger className="w-full">
                             <SelectValue placeholder="Select a recipient" />
                          </SelectTrigger>
                          <SelectContent>
                             {handoverRecipients.map(recipient => (
                                <SelectItem key={recipient.id} value={recipient.id.toString()}>
                                   {`${recipient.user.first_name} ${recipient.user.last_name}`}
                                </SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                    )}
                     {recipientsLoading || recipientsError || handoverRecipients.length === 0 && !recipientsError && (
                         <p className="text-sm text-text-light">No BP recipients found.</p>
                     )}
                  </div>
                  <div className="text-sm text-text-DEFAULT">
                    Total Amount to Handover: <span className="font-semibold">{totalSelectedAmount}</span>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={closeHandoverModal}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleHandover}
                      className="bg-primary-500 text-white hover:bg-primary-600"
                      disabled={!selectedRecipientId || loading}
                    >
                      Confirm Handover
                    </Button>
                  </div>
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