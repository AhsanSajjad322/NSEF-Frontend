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
} from "@/components/ui/table"
import { X } from 'lucide-react';
import { Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { getToken } from '../../utils/auth';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const itemsPerPage = 8;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TransactionsPage = () => {
    const { } = useAuth();
    const [activeTab, setActiveTab] = useState('online');
    const [onlineTransactions, setOnlineTransactions] = useState([]);
    const [cashTransactions, setCashTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editedAmount, setEditedAmount] = useState('');
    const [currentPageOnline, setCurrentPageOnline] = useState(1);
    const [currentPageCash, setCurrentPageCash] = useState(1);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);
            const token = getToken();
            if (!token) {
                setError('Authentication token not found.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/fund_tracking/transactions/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error fetching transactions: ${response.statusText}`);
                }

                const data = await response.json();
                console.log("data");
                console.log(data);

                const online = data.filter(transaction => transaction.mode === 'online');
                const cash = data.filter(transaction => transaction.mode === 'cash');

                // Sort transactions by created date descending
                const sortByDate = (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime();

                setOnlineTransactions(online.sort(sortByDate));
                setCashTransactions(cash.sort(sortByDate));

            } catch (err) {
                setError(err.message);
                console.error('Failed to fetch transactions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'online') {
            setCurrentPageOnline(1);
        } else {
            setCurrentPageCash(1);
        }
    };

    const openEditModal = (transaction) => {
        setEditingTransaction(transaction);
        setEditedAmount(transaction.amount.toString());
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingTransaction(null);
        setEditedAmount('');
    };

    const handleEditAmountChange = (event) => {
        setEditedAmount(event.target.value);
    };

    const saveEditedTransaction = async () => {
        if (!editingTransaction || editedAmount === '') return;

        setLoading(true);
        setError(null);
        const token = getToken();
        if (!token) {
            setError('Authentication token not found.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/fund_tracking/transactions/${editingTransaction.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: parseFloat(editedAmount) }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to update transaction');
            }

            const updatedTransaction = await response.json();

            setOnlineTransactions(prev =>
                prev.map(transaction =>
                    transaction.id === updatedTransaction.id ? updatedTransaction : transaction
                ).sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
            );

            closeEditModal();
        } catch (err) {
            setError(err.message);
            console.error('Failed to save transaction:', err);
        } finally {
            setLoading(false);
        }
    };

    const openDeleteConfirm = (transactionId) => {
        setTransactionToDelete(transactionId);
        setIsDeleteConfirmOpen(true);
    };

    const closeDeleteConfirm = () => {
        setIsDeleteConfirmOpen(false);
        setTransactionToDelete(null);
    };

    const deleteTransaction = async () => {
        if (!transactionToDelete) return;

        setLoading(true);
        setError(null);
        const token = getToken();
        if (!token) {
            setError('Authentication token not found.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/fund_tracking/transactions/${transactionToDelete}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to delete transaction');
            }

            // Remove the deleted transaction from the state
            setOnlineTransactions(prev => prev.filter(transaction => transaction.id !== transactionToDelete));

            closeDeleteConfirm();
        } catch (err) {
            setError(err.message);
            console.error('Failed to delete transaction:', err);
        } finally {
            setLoading(false);
        }
    };

    const sortTransactionsByMonth = (transactions) => {
         // Data is already sorted by created date from fetch, so this might not be needed unless you want month-based grouping/sorting
        return transactions;
    };

    const sortedOnlineTransactions = sortTransactionsByMonth(onlineTransactions);
    const sortedCashTransactions = sortTransactionsByMonth(cashTransactions);

    const indexOfLastOnline = currentPageOnline * itemsPerPage;
    const indexOfFirstOnline = indexOfLastOnline - itemsPerPage;
    const currentOnlineTransactions = sortedOnlineTransactions.slice(indexOfFirstOnline, indexOfLastOnline);

    const indexOfLastCash = currentPageCash * itemsPerPage;
    const indexOfFirstCash = indexOfLastCash - itemsPerPage;
    const currentCashTransactions = sortedCashTransactions.slice(indexOfFirstCash, indexOfLastCash);

    const totalOnlinePages = Math.ceil(sortedOnlineTransactions.length / itemsPerPage);
    const totalCashPages = Math.ceil(sortedCashTransactions.length / itemsPerPage);

    const handleNextPageOnline = () => {
        setCurrentPageOnline(prev => prev < totalOnlinePages ? prev + 1 : prev);
    };

    const handlePrevPageOnline = () => {
        setCurrentPageOnline(prev => prev > 1 ? prev - 1 : prev);
    };

    const handleNextPageCash = () => {
        setCurrentPageCash(prev => prev < totalCashPages ? prev + 1 : prev);
    };

    const handlePrevPageCash = () => {
        setCurrentPageCash(prev => prev > 1 ? prev - 1 : prev);
    };

     const formatMonth = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM');
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
            return 'N/A';
        }
    };


    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="text-sm text-text-light mb-4">
                    Personal / <span className="font-semibold text-text-DEFAULT">Transactions</span>
                </div>

                {error && (
                     <div className="text-red-500 text-sm text-center mb-4">{error}</div>
                )}

                {loading && <div className="text-center text-text-DEFAULT">Loading transactions...</div>}

                {!loading && !error && (
                    <>
                        {/* Tabs */}
                        <div className="mb-4 border-b border-muted-DEFAULT">
                            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                                <button
                                    onClick={() => handleTabChange('online')}
                                    className={`${activeTab === 'online' ? 'border-primary-DEFAULT text-primary-DEFAULT' : 'border-transparent text-text-light hover:text-text-DEFAULT hover:border-text-DEFAULT'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Online
                                </button>
                                <button
                                    onClick={() => handleTabChange('cash')}
                                    className={`${activeTab === 'cash' ? 'border-primary-DEFAULT text-primary-DEFAULT' : 'border-transparent text-text-light hover:text-text-DEFAULT hover:border-text-DEFAULT'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Cash
                                </button>
                            </nav>
                        </div>

                        {/* Online Transactions */}
                        {activeTab === 'online' && (
                            <Card className="shadow-sm border border-muted-DEFAULT">
                                <CardContent className="p-4">
                                    <h2 className="text-lg font-semibold mb-4 text-text-DEFAULT">Online Transactions</h2>
                                    {currentOnlineTransactions.length === 0 && sortedOnlineTransactions.length > 0 && (
                                        <div className="text-center py-4 text-text-light">No online transactions on this page.</div>
                                    )}
                                    {sortedOnlineTransactions.length === 0 && (
                                        <div className="text-center py-4 text-text-light">No online transactions found.</div>
                                    )}
                                    {currentOnlineTransactions.length > 0 && (
                                         <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[100px]">Month</TableHead>
                                                    <TableHead>Amount</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {currentOnlineTransactions.map((transaction) => (
                                                    <TableRow key={transaction.id}>
                                                        <TableCell>{formatMonth(transaction.created)}</TableCell>
                                                        <TableCell>{transaction.amount}</TableCell>
                                                        <TableCell>{transaction.verification_state}</TableCell>
                                                        <TableCell className="text-right">
                                                            {transaction.verification_state === 'pending' ? (
                                                                <div className="flex items-center justify-end space-x-2">
                                                                    <Button variant="outline" size="icon" onClick={() => openEditModal(transaction)}>
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="destructive" size="icon" onClick={() => openDeleteConfirm(transaction.id)}>
                                                                        <Trash className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ) : (transaction.verification_state === 'verified' ? (
                                                                 <span className="text-green-600">Verified</span>
                                                            ) : (
                                                                 <span className="text-red-600">Rejected</span>
                                                            ))
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}

                                    {sortedOnlineTransactions.length > itemsPerPage && (
                                        <div className="flex justify-between items-center mt-4">
                                            <Button onClick={handlePrevPageOnline} disabled={currentPageOnline === 1}>
                                                Previous
                                            </Button>
                                            <span>{currentPageOnline} of {totalOnlinePages}</span>
                                            <Button onClick={handleNextPageOnline} disabled={currentPageOnline === totalOnlinePages}>
                                                Next
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Cash Transactions */}
                        {activeTab === 'cash' && (
                            <Card className="shadow-sm border border-muted-DEFAULT">
                                <CardContent className="p-4">
                                    <h2 className="text-lg font-semibold mb-4 text-text-DEFAULT">Cash Transactions</h2>
                                     {currentCashTransactions.length === 0 && sortedCashTransactions.length > 0 && (
                                        <div className="text-center py-4 text-text-light">No cash transactions on this page.</div>
                                    )}
                                    {sortedCashTransactions.length === 0 && (
                                        <div className="text-center py-4 text-text-light">No cash transactions found.</div>
                                    )}
                                    {currentCashTransactions.length > 0 && (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[100px]">Month</TableHead>
                                                    <TableHead>Amount</TableHead>
                                                    <TableHead>Handed To</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {currentCashTransactions.map((transaction) => (
                                                    <TableRow key={transaction.id}>
                                                        <TableCell>{formatMonth(transaction.created)}</TableCell>
                                                        <TableCell>{transaction.amount}</TableCell>
                                                        <TableCell>{transaction.receiver?.user ? `${transaction.receiver.user.first_name} ${transaction.receiver.user.last_name}` : 'N/A'}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}

                                    {sortedCashTransactions.length > itemsPerPage && (
                                        <div className="flex justify-between items-center mt-4">
                                            <Button onClick={handlePrevPageCash} disabled={currentPageCash === 1}>
                                                Previous
                                            </Button>
                                            <span>{currentPageCash} of {totalCashPages}</span>
                                            <Button onClick={handleNextPageCash} disabled={currentPageCash === totalCashPages}>
                                                Next
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </>
                 )}


                {/* Edit Transaction Modal */}
                {isEditModalOpen && ( // Simplified modal rendering
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Edit Online Transaction</h3>
                                <Button variant="ghost" size="icon" onClick={closeEditModal}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="amount" className="text-right">Amount</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={editedAmount}
                                        onChange={handleEditAmountChange}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={closeEditModal}>Cancel</Button>
                                <Button onClick={saveEditedTransaction} disabled={loading}>Save Changes</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your transaction.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={closeDeleteConfirm}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteTransaction} className="bg-red-600 text-white hover:bg-red-700">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>
    );
};

export default TransactionsPage;