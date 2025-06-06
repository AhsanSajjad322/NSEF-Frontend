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
import { getToken } from '@/utils/auth';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const itemsPerPage = 5;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const NSFTCashReceivalConfirmationPage = () => {
    const [transactionsToConfirm, setTransactionsToConfirm] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isVerifyConfirmOpen, setIsVerifyConfirmOpen] = useState(false);
    const [transactionToVerifyId, setTransactionToVerifyId] = useState(null);

    useEffect(() => {
        fetchTransactionsToConfirm();
    }, []);

    const fetchTransactionsToConfirm = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = getToken();
            if (!token) {
                setError('Authentication token not found.');
                setLoading(false);
                return;
            }

            const response = await fetch(`${BACKEND_URL}/fund_tracking/transactions/linked/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching transactions: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Fetched forwarded transactions (for NSFT Confirmation):', data);

            const unverifiedTransactions = data.filter(transaction => !transaction.is_verified_by_forwardee);

            setTransactionsToConfirm(unverifiedTransactions);
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyClick = (transactionId) => {
        setTransactionToVerifyId(transactionId);
        setIsVerifyConfirmOpen(true);
    };

    const handleVerifyConfirm = async () => {
        if (!transactionToVerifyId) return;

        try {
            setLoading(true);
            setError(null);
            const token = getToken();
            if (!token) {
                setError('Authentication token not found.');
                setLoading(false);
                return;
            }

            const response = await fetch(`${BACKEND_URL}/fund_tracking/transactions/forwarded/${transactionToVerifyId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ is_verified_by_forwardee: true }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error verifying transaction: ${response.statusText}`);
            }

            fetchTransactionsToConfirm();
            setIsVerifyConfirmOpen(false);
            setTransactionToVerifyId(null);
        } catch (err) {
            setError(err.message);
            console.error('Failed to verify transaction:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCancel = () => {
        setIsVerifyConfirmOpen(false);
        setTransactionToVerifyId(null);
    };

    const indexOfLastTransaction = currentPage * itemsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
    const currentTransactions = transactionsToConfirm.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const totalPages = Math.ceil(transactionsToConfirm.length / itemsPerPage);

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
                    NSFT / <span className="font-semibold text-text-DEFAULT">Cash Receival Confirmation</span>
                </div>

                <h2 className="text-lg font-semibold text-text-DEFAULT mb-4">Transactions Awaiting Your Confirmation</h2>

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
                                        <TableHead>Forwarder Name</TableHead>
                                        <TableHead>Forwarder CMS</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentTransactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>{`${transaction.forwarder.user.first_name} ${transaction.forwarder.user.last_name}`}</TableCell>
                                            <TableCell>{transaction.forwarder.cms}</TableCell>
                                            <TableCell>{transaction.forwarded_amount}</TableCell>
                                            <TableCell>{format(new Date(transaction.created), 'MMMM dd, yyyy')}</TableCell>
                                            <TableCell className="text-right">
                                                {!transaction.is_verified_by_forwardee && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-500 hover:bg-green-600 text-white"
                                                        onClick={() => handleVerifyClick(transaction.id)}
                                                        disabled={loading}
                                                    >
                                                        <Check className="h-4 w-4 mr-2" />
                                                        Verify
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {currentTransactions.length === 0 && transactionsToConfirm.length > 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-4">No transactions found on this page.</TableCell>
                                        </TableRow>
                                    )}
                                    {transactionsToConfirm.length === 0 && !loading && !error && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-4">No cash receival confirmations pending.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}

                        {transactionsToConfirm.length > itemsPerPage && (
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
                    </CardContent>
                </Card>

                {/* Verification Confirmation AlertDialog */}
                <AlertDialog open={isVerifyConfirmOpen} onOpenChange={setIsVerifyConfirmOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Cash Receival</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to confirm receiving this cash?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleVerifyCancel}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleVerifyConfirm}>Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default NSFTCashReceivalConfirmationPage;