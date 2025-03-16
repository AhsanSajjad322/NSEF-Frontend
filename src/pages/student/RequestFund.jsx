import React, { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const RequestFundPage = () => {
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [contactNumber, setContactNumber] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const requestData = {
            amount,
            reason,
            bankName,
            accountNumber,
            accountHolderName,
            contactNumber,
        };
        console.log('Fund Request Data:', requestData);
        // In a real application, you would send this data to your server
        // You might also want to show a success message to the user
    };

    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="text-sm text-text-light mb-4">
                    Personal / <span className="font-semibold text-text-DEFAULT">Request Fund</span>
                </div>

                {/* Request Fund Form */}
                <Card className="shadow-sm border border-muted-DEFAULT">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold mb-4 text-text-DEFAULT">Request Fund</h2>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="amount" className="text-text-DEFAULT">
                                    Amount Requested (PKR)
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="reason" className="text-text-DEFAULT">
                                    Reason for Request
                                </Label>
                                <Textarea
                                    id="reason"
                                    placeholder="Explain why you need the fund"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="bankName" className="text-text-DEFAULT">
                                    Bank Name
                                </Label>
                                <Input
                                    id="bankName"
                                    type="text"
                                    placeholder="Enter bank name"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="accountNumber" className="text-text-DEFAULT">
                                    Account Number
                                </Label>
                                <Input
                                    id="accountNumber"
                                    type="text"
                                    placeholder="Enter account number"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="accountHolderName" className="text-text-DEFAULT">
                                    Account Holder Name
                                </Label>
                                <Input
                                    id="accountHolderName"
                                    type="text"
                                    placeholder="Enter account holder name"
                                    value={accountHolderName}
                                    onChange={(e) => setAccountHolderName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contactNumber" className="text-text-DEFAULT">
                                    Contact Number
                                </Label>
                                <Input
                                    id="contactNumber"
                                    type="tel"
                                    placeholder="Enter your contact number"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="bg-primary-500 text-white hover:bg-primary-600">
                                Submit Request
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RequestFundPage;