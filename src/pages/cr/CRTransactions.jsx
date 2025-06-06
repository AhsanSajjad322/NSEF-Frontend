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
import { Edit, Trash2, Search } from 'lucide-react';
import { X } from 'lucide-react';
import { getToken } from '@/utils/auth';

const itemsPerPage = 7;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CRTransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editedAmount, setEditedAmount] = useState('');
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
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
            // Filter only cash transactions
            const cashTransactions = data.filter(transaction => transaction.mode === 'cash');
            setTransactions(cashTransactions);
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

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

    const getStatusDisplay = (state) => {
        switch (state) {
            case 'initiated':
                return 'Initiated';
            case 'processing':
                return 'Processing';
            case 'completed':
                return 'Completed';
            default:
                return state;
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

    const handleEditedAmountChange = (event) => {
        setEditedAmount(event.target.value);
    };

    const saveEditedAmount = async () => {
        if (!editingTransaction) return;

        try {
            setLoading(true);
            setError(null);
            const token = getToken();
            if (!token) {
                setError('Authentication token not found.');
                return;
            }

            const response = await fetch(`${BACKEND_URL}/fund_tracking/transactions/${editingTransaction.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: parseFloat(editedAmount) }),
            });

            if (!response.ok) {
                throw new Error('Failed to update transaction');
            }

            // Refresh transactions after successful update
            await fetchTransactions();
            closeEditModal();
        } catch (err) {
            setError(err.message);
            console.error('Failed to update transaction:', err);
        } finally {
            setLoading(false);
        }
    };

    const openDeleteConfirmation = (transaction) => {
        setTransactionToDelete(transaction);
        setIsDeleteConfirmationOpen(true);
    };

    const closeDeleteConfirmation = () => {
        setIsDeleteConfirmationOpen(false);
        setTransactionToDelete(null);
    };

    const handleDeleteTransaction = async () => {
        if (!transactionToDelete) return;

        try {
            setLoading(true);
            setError(null);
            const token = getToken();
            if (!token) {
                setError('Authentication token not found.');
                return;
            }

            const response = await fetch(`${BACKEND_URL}/fund_tracking/transactions/${transactionToDelete.id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete transaction');
            }

            // Refresh transactions after successful deletion
            await fetchTransactions();
            closeDeleteConfirmation();
        } catch (err) {
            setError(err.message);
            console.error('Failed to delete transaction:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        const searchLower = searchTerm.toLowerCase();
        const studentName = `${transaction.sender.user.first_name} ${transaction.sender.user.last_name}`.toLowerCase();
        return (
            studentName.includes(searchLower) ||
            transaction.sender.cms.toString().toLowerCase().includes(searchLower)
        );
    }).filter(transaction => {
        if (statusFilter === 'all') return true;
        return transaction.state === statusFilter;
    });

    const indexOfLastTransaction = currentPage * itemsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

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
                    CR / <span className="font-semibold text-text-DEFAULT">Cash Transactions</span>
                </div>

                {/* Search and Filters */}
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
                    
                    <div className="flex items-center space-x-2">
                        <Label className="text-text-DEFAULT">Filter Status:</Label>
                        <select
                            className="rounded-md border border-muted-DEFAULT shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-sm dark:bg-background-DEFAULT dark:border-muted-DEFAULT dark:text-text-DEFAULT"
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                        >
                            <option value="all">All</option>
                            <option value="initiated">Initiated</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Transactions List */}
                <Card className="shadow-sm border border-muted-DEFAULT">
                    <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-4 text-text-DEFAULT">Cash Transactions</h2>
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
                                            <TableCell>{getStatusDisplay(transaction.state)}</TableCell>
                                            <TableCell className="text-right">
                                                {transaction.state === 'initiated' && (
                                                    <div className='flex justify-end'>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => openEditModal(transaction)}
                                                            className="mr-2"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            onClick={() => openDeleteConfirmation(transaction)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {currentTransactions.length === 0 && filteredTransactions.length > 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-4">No transactions found on this page.</TableCell>
                                        </TableRow>
                                    )}
                                    {filteredTransactions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-4">No transactions match your search criteria.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}

                        {filteredTransactions.length > itemsPerPage && (
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

                {/* Edit Amount Modal */}
                {isEditModalOpen && editingTransaction && (
                    <div className="fixed px-3 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-md shadow-lg w-full max-w-md">
                            <div className="p-4 border-b border-muted-DEFAULT flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-text-DEFAULT">Edit Transaction Amount</h2>
                                <Button variant="ghost" size="icon" onClick={closeEditModal} className="text-text-light hover:bg-muted-DEFAULT">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-4">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-amount" className="text-text-DEFAULT">
                                            Amount for {`${editingTransaction.sender.user.first_name} ${editingTransaction.sender.user.last_name}`} (CMS: {editingTransaction.sender.cms})
                                        </Label>
                                        <Input
                                            id="edit-amount"
                                            type="number"
                                            placeholder="Enter new amount"
                                            value={editedAmount}
                                            onChange={handleEditedAmountChange}
                                        />
                                    </div>
                                    <Button onClick={saveEditedAmount} className="bg-primary-500 text-white hover:bg-primary-600">
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteConfirmationOpen && transactionToDelete && (
                    <div className="fixed px-3 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-md shadow-lg w-full max-w-sm">
                            <div className="p-4 border-b border-muted-DEFAULT flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-text-DEFAULT">Confirm Delete</h2>
                                <Button variant="ghost" size="icon" onClick={closeDeleteConfirmation} className="text-text-light hover:bg-muted-DEFAULT">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-4">
                                <p className="text-text-DEFAULT">
                                    Are you sure you want to delete the transaction for{' '}
                                    <span className="font-semibold">{`${transactionToDelete.sender.user.first_name} ${transactionToDelete.sender.user.last_name}`}</span> (CMS: {transactionToDelete.sender.cms})?
                                </p>
                                <div className="flex justify-end mt-4 space-x-2">
                                    <Button variant="secondary" onClick={closeDeleteConfirmation}>
                                        Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={handleDeleteTransaction}>
                                        Delete
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

export default CRTransactionsPage;