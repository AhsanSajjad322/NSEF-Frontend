import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

const itemsPerPage = 5;

const NSFTCashReceivalConfirmationPage = () => {
    // Sample data - replace with actual API calls
    const [transactionsToConfirm, setTransactionsToConfirm] = useState([
        { id: 101, bpName: 'Ali Raza (BR)', amount: 7500, handoverDate: '2025-03-15', status: 'pending_nsft_confirmation' },
        { id: 102, bpName: 'Sana Khan (BR)', amount: 11000, handoverDate: '2025-03-16', status: 'pending_nsft_confirmation' },
        { id: 103, bpName: 'Usman Ghani (BR)', amount: 9000, handoverDate: '2025-03-17', status: 'pending_nsft_confirmation' },
        { id: 104, bpName: 'Zain Malik (BR)', amount: 6000, handoverDate: '2025-03-18', status: 'pending_nsft_confirmation' },
        { id: 105, bpName: 'Aisha Iqbal (BR)', amount: 12000, handoverDate: '2025-03-19', status: 'pending_nsft_confirmation' },
        { id: 106, bpName: 'Fahad Khan (BR)', amount: 8000, handoverDate: '2025-03-20', status: 'pending_nsft_confirmation' },
        { id: 107, bpName: 'Hira Butt (BR)', amount: 10500, handoverDate: '2025-03-21', status: 'pending_nsft_confirmation' },
        { id: 108, bpName: 'Kamran Ali (BR)', amount: 9500, handoverDate: '2025-03-22', status: 'pending_nsft_confirmation' },
        { id: 109, bpName: 'Sidra Khan (BR)', amount: 11500, handoverDate: '2025-03-23', status: 'pending_nsft_confirmation' },
    ]);

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [transactionToVerify, setTransactionToVerify] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(transactionsToConfirm.length / itemsPerPage);
    const indexOfLastTransaction = currentPage * itemsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
    const currentTransactions = transactionsToConfirm.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const handleVerifyClick = (transaction) => {
        setTransactionToVerify(transaction);
        setIsConfirmationModalOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
        setTransactionToVerify(null);
    };

    const handleConfirmVerification = () => {
        if (transactionToVerify) {
            // In a real application, you would make an API call here to update the transaction status
            const updatedTransactions = transactionsToConfirm.map(transaction =>
                transaction.id === transactionToVerify.id ? { ...transaction, status: 'received' } : transaction
            );
            setTransactionsToConfirm(updatedTransactions);
            closeConfirmationModal();
            alert(`Verification confirmed for amount PKR ${transactionToVerify.amount} received from ${transactionToVerify.crName} on ${format(new Date(transactionToVerify.handoverDate), 'MMMM dd, yyyy')}`);
        }
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="text-sm text-text-light mb-4">
                    NSFT / <span className="font-semibold text-text-DEFAULT">Cash Receival Confirmation</span>
                </div>

                <h2 className="text-lg font-semibold text-text-DEFAULT mb-4">Transactions Awaiting Your Confirmation</h2>

                <Card className="shadow-sm border border-muted-DEFAULT">
                    <CardContent className="p-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>BP Name</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Handover Date</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentTransactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{transaction.bpName}</TableCell>
                                        <TableCell>{transaction.amount}</TableCell>
                                        <TableCell>{format(new Date(transaction.handoverDate), 'MMMM dd, yyyy')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button onClick={() => handleVerifyClick(transaction)} className="bg-primary-500 text-white hover:bg-primary-600">
                                                Verify <Check className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {currentTransactions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4">No transactions awaiting your confirmation on this page.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {transactionsToConfirm.length > itemsPerPage && (
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

                {/* Confirmation Modal */}
                {isConfirmationModalOpen && transactionToVerify && (
                    <div className="fixed px-3 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-md shadow-lg w-full max-w-md">
                            <div className="p-4 border-b border-muted-DEFAULT flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-text-DEFAULT">Confirm Cash Receival</h2>
                                <Button variant="ghost" size="icon" onClick={closeConfirmationModal} className="text-text-light hover:bg-muted-DEFAULT">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-4 grid gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-text-DEFAULT">BP Name:</Label>
                                    <p className="text-text-DEFAULT font-semibold">{transactionToVerify.crName}</p>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-text-DEFAULT">Amount Received:</Label>
                                    <p className="text-text-DEFAULT font-semibold">PKR {transactionToVerify.amount}</p>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-text-DEFAULT">Handover Date:</Label>
                                    <p className="text-text-DEFAULT font-semibold">{format(new Date(transactionToVerify.handoverDate), 'MMMM dd, yyyy')}</p>
                                </div>
                                <p className="text-text-DEFAULT">Are you sure you want to confirm that you have received this amount?</p>
                            </div>
                            <div className="flex justify-end space-x-2 p-4">
                                <Button variant="secondary" onClick={closeConfirmationModal}>
                                    Cancel
                                </Button>
                                <Button onClick={handleConfirmVerification} className="bg-primary-500 text-white hover:bg-primary-600">
                                    Confirm Verification
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NSFTCashReceivalConfirmationPage;