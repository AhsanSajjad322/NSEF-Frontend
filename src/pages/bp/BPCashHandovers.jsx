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

const itemsPerPage = 5; // Adjust as needed
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BPCashHandoversPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [totalSelectedAmount, setTotalSelectedAmount] = useState(0);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [handoverRecipients, setHandoverRecipients] = useState([]); // State to hold NSFT recipients
  const [selectedRecipientId, setSelectedRecipientId] = useState(''); // State to hold selected recipient's user ID
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipientsLoading, setRecipientsLoading] = useState(true);
  const [recipientsError, setRecipientsError] = useState(null);

  useEffect(() => {
    fetchTransactions();
    fetchRecipients(); // Fetch recipients (NSFT users) when component mounts
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

      // Fetch linked transactions where the current BP is the forwardee
      const response = await fetch(`${BACKEND_URL}/fund_tracking/transactions/linked/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching transactions: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched linked transactions (for BP Handover):', data); // Console log fetched data

      // For BP Handover page, show transactions that have been verified by the forwardee (the current BP)
      const verifiedTransactions = data.filter(transaction => transaction.is_verified_by_forwardee === true && transaction.is_forwarded === false);

      setTransactions(verifiedTransactions);
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
      // Filter for users with group 'NSFT' as recipients for BP handovers
      const nsftUsers = data.filter(representative =>
        representative.user.groups.includes('NSFT')
      );
      setHandoverRecipients(nsftUsers);
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
        // Sum the forwarded_amount for selected verified linked transactions
        total += transaction.forwarded_amount;
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

      // Get the selected linked transactions
      const selectedLinkedTransactions = transactions.filter(transaction =>
        selectedTransactionIds.has(transaction.id)
      );

      // Extract original transaction IDs from the nested 'transactions' array of selected linked transactions
      const transactionsIdsToSend = selectedLinkedTransactions.flatMap(linkedTx =>
        linkedTx.transactions.map(originalTx => originalTx.id)
      );

      // Extract the IDs of the selected linked transactions themselves
      const previousTransactionsIdsToSend = selectedLinkedTransactions.map(linkedTx => linkedTx.id);

      const payload = {
        transactions_ids: transactionsIdsToSend,
        previous_transactions_ids: previousTransactionsIdsToSend,
        forwardee_id: parseInt(selectedRecipientId), // Use the selected NSFT's user ID
        forwarded_amount: totalSelectedAmount, // Use the calculated total forwarded amount
      };

      console.log('Payload being sent from BP Handover to /forward:', payload); // Console log the payload

      const response = await fetch(`${BACKEND_URL}/fund_tracking/transactions/forward/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || `Failed to forward transactions: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Forwarded transactions response data:', data); // Console log the response data

      // Refresh the transactions list (should now fetch updated verified transactions)
      fetchTransactions();

      // Close the modal and reset the selected transactions and recipient
      setSelectedTransactionIds(new Set());
      setSelectAll(false);
      setTotalSelectedAmount(0);
      closeHandoverModal();
    } catch (err) {
      setError(err.message);
      console.error('Failed to forward transactions:', err);
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
          BP / <span className="font-semibold text-text-DEFAULT">Cash Handovers</span>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-text-DEFAULT">Verified Received Transactions</h2>
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
                    <TableHead>Forwarder Name</TableHead>
                    <TableHead>Forwarder CMS</TableHead>
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
                      <TableCell>{`${transaction.forwarder.user.first_name} ${transaction.forwarder.user.last_name}`}</TableCell>
                      <TableCell>{transaction.forwarder.cms}</TableCell>
                      <TableCell>{transaction.forwarded_amount}</TableCell>
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
                      <TableCell colSpan={5} className="text-center py-4">No verified received transactions found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {transactions.length > itemsPerPage && (
              <div className="flex justify-between items-center mt-4">
                <Button onClick={handlePrevPage} disabled={currentPage === 1 || loading}>
                  Previous
                </Button>
                <span>{currentPage} of {totalPages}</span>
                <Button onClick={handleNextPage} disabled={currentPage === totalPages || loading}>
                  Next
                </Button>
              </div>
            )}

            {transactions.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button
                  className='bg-primary-800 flex justify-start'
                  onClick={openHandoverModal}
                  disabled={selectedTransactionIds.size === 0 || loading}
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
                <h2 className="text-lg font-semibold text-text-DEFAULT">Select NSFT Recipient</h2>
                <Button variant="ghost" size="icon" onClick={closeHandoverModal} className="text-text-light hover:bg-muted-DEFAULT">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="recipient" className="text-text-DEFAULT">Recipient (NSFT)</Label>
                    {recipientsLoading ? (
                      <p className="text-text-DEFAULT">Loading recipients...</p>
                    ) : recipientsError ? (
                      <p className="text-red-500">{recipientsError}</p>
                    ) : (
                       <Select onValueChange={handleRecipientChange} value={selectedRecipientId} disabled={handoverRecipients.length === 0 || loading}>
                          <SelectTrigger className="w-full">
                             <SelectValue placeholder="Select an NSFT recipient" />
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
                         <p className="text-sm text-text-light">No NSFT recipients found.</p>
                     )}
                  </div>
                  <div className="text-sm text-text-DEFAULT">
                    Total Amount to Handover: <span className="font-semibold">{totalSelectedAmount}</span>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="secondary" onClick={closeHandoverModal} disabled={loading}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleHandover}
                      className="bg-primary-500 text-white hover:bg-primary-600"
                      disabled={!selectedRecipientId || selectedTransactionIds.size === 0 || loading}
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

export default BPCashHandoversPage;