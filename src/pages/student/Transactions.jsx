import React, { useState } from 'react';
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

const itemsPerPage = 8;

const TransactionsPage = () => {
    const [activeTab, setActiveTab] = useState('online');
    const [onlineTransactions, setOnlineTransactions] = useState([
        { id: 1, amount: 100, month: new Date('2025-03-01'), status: 'Verified' },
        { id: 2, amount: 50, month: new Date('2025-03-05'), status: 'Pending' },
        { id: 3, amount: 200, month: new Date('2025-02-15'), status: 'Verified' },
        { id: 4, amount: 75, month: new Date('2025-03-10'), status: 'Pending' },
        { id: 5, amount: 100, month: new Date('2025-03-01'), status: 'Verified' },
        { id: 6, amount: 50, month: new Date('2025-03-05'), status: 'Pending' },
        { id: 7, amount: 200, month: new Date('2025-02-15'), status: 'Verified' },
        { id: 8, amount: 75, month: new Date('2025-03-10'), status: 'Pending' },
        { id: 9, amount: 100, month: new Date('2025-03-01'), status: 'Verified' },
        { id: 10, amount: 50, month: new Date('2025-03-05'), status: 'Pending' },
        { id: 11, amount: 200, month: new Date('2025-02-15'), status: 'Verified' },
        { id: 12, amount: 75, month: new Date('2025-03-10'), status: 'Pending' },
        { id: 13, amount: 100, month: new Date('2025-03-01'), status: 'Verified' },
        { id: 14, amount: 50, month: new Date('2025-03-05'), status: 'Pending' },
        { id: 15, amount: 200, month: new Date('2025-02-15'), status: 'Verified' },
        { id: 16, amount: 75, month: new Date('2025-03-10'), status: 'Pending' },
    ]);
    const [cashTransactions, setCashTransactions] = useState([
        { id: 5, amount: 25, month: new Date('2025-03-02'), handedTo: 'Ahsan' },
        { id: 6, amount: 150, month: new Date('2025-02-20'), handedTo: 'Ahsan' },
        { id: 7, amount: 25, month: new Date('2025-03-02'), handedTo: 'Ahsan' },
        { id: 8, amount: 150, month: new Date('2025-02-20'), handedTo: 'Ahsan' },
        { id: 9, amount: 25, month: new Date('2025-03-02'), handedTo: 'Ahsan' },
        { id: 10, amount: 150, month: new Date('2025-02-20'), handedTo: 'Ahsan' },
    ]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editedAmount, setEditedAmount] = useState('');
    const [currentPageOnline, setCurrentPageOnline] = useState(1);
    const [currentPageCash, setCurrentPageCash] = useState(1);

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

    const saveEditedTransaction = () => {
        if (editingTransaction) {
            const updatedTransactions = onlineTransactions.map(transaction =>
                transaction.id === editingTransaction.id ? { ...transaction, amount: parseFloat(editedAmount) } : transaction
            );
            setOnlineTransactions(updatedTransactions);
            closeEditModal();
        }
    };

    const deleteTransaction = (id) => {
        const updatedTransactions = onlineTransactions.filter(transaction => transaction.id !== id);
        setOnlineTransactions(updatedTransactions);
    };

    const sortTransactionsByMonth = (transactions) => {
        return [...transactions].sort((a, b) => b.month.getTime() - a.month.getTime());
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

    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="text-sm text-text-light mb-4">
                    Personal / <span className="font-semibold text-text-DEFAULT">Transactions</span>
                </div>

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
                                            <TableCell>{format(transaction.month, 'MMM')}</TableCell>
                                            <TableCell>{transaction.amount}</TableCell>
                                            <TableCell>{transaction.status}</TableCell>
                                            <TableCell className="text-right">
                                                {transaction.status === 'Pending' ? (
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Button variant="outline" size="icon" onClick={() => openEditModal(transaction)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="destructive" size="icon" onClick={() => deleteTransaction(transaction.id)}>
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-text-light">Verified</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {currentOnlineTransactions.length === 0 && sortedOnlineTransactions.length > 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-4">No online transactions on this page.</TableCell>
                                        </TableRow>
                                    )}
                                    {sortedOnlineTransactions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-4">No online transactions found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
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
                                            <TableCell>{format(transaction.month, 'MMM')}</TableCell>
                                            <TableCell>{transaction.amount}</TableCell>
                                            <TableCell>{transaction.handedTo}</TableCell>
                                        </TableRow>
                                    ))}
                                    {currentCashTransactions.length === 0 && sortedCashTransactions.length > 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-4">No cash transactions on this page.</TableCell>
                                        </TableRow>
                                    )}
                                    {sortedCashTransactions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-4">No cash transactions found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
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

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed px-3 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-md shadow-lg w-full max-w-md">
                            <div className="p-4 border-b border-muted-DEFAULT flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-text-DEFAULT">Edit Online Transaction</h2>
                                <Button variant="ghost" size="icon" onClick={closeEditModal} className="text-text-light hover:bg-muted-DEFAULT">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-4">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-amount" className="text-text-DEFAULT">
                                            Amount
                                        </Label>
                                        <Input
                                            id="edit-amount"
                                            type="number"
                                            placeholder="Enter new amount"
                                            value={editedAmount}
                                            onChange={handleEditAmountChange}
                                        />
                                    </div>
                                    <Button onClick={saveEditedTransaction} className="bg-primary-500 text-white hover:bg-primary-600">
                                        Save Changes
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

export default TransactionsPage;