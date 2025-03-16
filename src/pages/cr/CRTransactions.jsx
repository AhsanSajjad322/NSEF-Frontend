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

const itemsPerPage = 7;

const CRTransactionsPage = () => {
    const [transactions, setTransactions] = useState([
        { id: 1, name: 'Ali Ahmed', cms: '368854', amount: 25000, date: '2025-03-01', status: 'processed' },
        { id: 2, name: 'Sara Khan', cms: '368853', amount: 10000, date: '2025-03-05', status: 'unprocessed' },
        { id: 3, name: 'Usman Ghani', cms: '368852', amount: 15000, date: '2025-03-10', status: 'processing' },
        { id: 4, name: 'Ayesha Siddiqui', cms: '368157', amount: 5000, date: '2025-03-12', status: 'unprocessed' },
        { id: 5, name: 'Bilal Raza', cms: '368857', amount: 20000, date: '2025-03-15', status: 'processed' },
        { id: 6, name: 'Fatima Ali', cms: '368655', amount: 7500, date: '2025-03-16', status: 'processing' },
        { id: 7, name: 'Hamza Khan', cms: '368856', amount: 12000, date: '2025-03-02', status: 'unprocessed' },
        { id: 8, name: 'Nimra Butt', cms: '368859', amount: 18000, date: '2025-03-07', status: 'processed' },
        { id: 9, name: 'Qasim Shah', cms: '362857', amount: 9000, date: '2025-03-11', status: 'unprocessed' },
        { id: 10, name: 'Sana Javed', cms: '265857', amount: 22000, date: '2025-03-14', status: 'processing' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editedAmount, setEditedAmount] = useState('');
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };


    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
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

    const saveEditedAmount = () => {
        if (editingTransaction) {
            const updatedTransactions = transactions.map(transaction =>
                transaction.id === editingTransaction.id ? { ...transaction, amount: parseFloat(editedAmount) } : transaction
            );
            setTransactions(updatedTransactions);
            closeEditModal();
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

    const handleDeleteTransaction = () => {
        if (transactionToDelete) {
            const updatedTransactions = transactions.filter(transaction => transaction.id !== transactionToDelete.id);
            setTransactions(updatedTransactions);
            closeDeleteConfirmation();
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        const searchLower = searchTerm.toLowerCase();
        return (
            transaction.name.toLowerCase().includes(searchLower) ||
            transaction.cms.toLowerCase().includes(searchLower)
        );
    }).filter(transaction => {
        if (statusFilter === 'all') return true;
        return transaction.status === statusFilter;
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
                            <option value="processed">Processed</option>
                            <option value="unprocessed">Unprocessed</option>
                            <option value="processing">Processing</option>
                        </select>
                    </div>
                </div>

                {/* Transactions List */}
                <Card className="shadow-sm border border-muted-DEFAULT">
                    <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-4 text-text-DEFAULT">Cash Transactions</h2>
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
                                        <TableCell>{transaction.name}</TableCell>
                                        <TableCell>{transaction.cms}</TableCell>
                                        <TableCell>{transaction.amount}</TableCell>
                                        <TableCell>{transaction.date}</TableCell>
                                        <TableCell>{transaction.status}</TableCell>
                                        <TableCell className="text-right">
                                            {transaction.status === 'unprocessed' && (
                                                <div className='flex'>
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
                                            Amount for {editingTransaction.name} (CMS: {editingTransaction.cms})
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
                                    <span className="font-semibold">{transactionToDelete.name}</span> (CMS: {transactionToDelete.cms})?
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