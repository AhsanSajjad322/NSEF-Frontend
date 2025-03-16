import React, { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

const DonateOnlinePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [donationReceipt, setDonationReceipt] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    const bankDetails = {
        bankName: 'Sadapay',
        accountNumber: '0335-8477227',
        holderName: "Muhammad Ahsan Sajjad"
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setDonationReceipt(null);
        setDonationAmount('');
        setImagePreviewUrl(null);
    };

    const handleReceiptUpload = (event) => {
        const file = event.target.files[0];
        setDonationReceipt(file);
        if (file) {
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setImagePreviewUrl(null);
        }
        // You might want to add validation for the file type and size here
    };

    const handleAmountChange = (event) => {
        setDonationAmount(event.target.value);
    };

    const handleSubmitDonation = () => {
        // In a real application, you would send the donationReceipt and donationAmount to your server
        console.log('Donation Receipt:', donationReceipt);
        console.log('Donation Amount:', donationAmount);
        handleCloseModal();
        // Optionally, you can show a success message to the user
    };

    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="text-sm text-text-light mb-4">
                    Home / <span className="font-semibold text-text-DEFAULT">Donate Online</span>
                </div>

                {/* Bank Account Information */}
                <Card className="shadow-sm border border-muted-DEFAULT mb-4 bg-primary-700">
                    <CardContent className="p-4">
                        <h2 className="text-xl font-semibold mb-2 text-white">Bank Account Information</h2>
                        <p className="text-white">
                            <strong>Bank Name:</strong> {bankDetails.bankName}
                        </p>
                        <p className="text-white">
                            <strong>Account Number:</strong> {bankDetails.accountNumber}
                        </p>
                        <p className="text-white">
                            <strong>Account Name:</strong> {bankDetails.holderName}
                        </p>
                    </CardContent>
                </Card>

                {/* Donate Button */}
                <Button onClick={handleOpenModal} className="bg-secondary-500 text-white hover:bg-secondary-600">
                    Donate Now
                </Button>

                {/* Donation Upload Modal */}
                {isModalOpen && (
                    <div className="fixed px-3 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-md shadow-lg w-full max-w-md">
                            <div className="p-4 border-b border-muted-DEFAULT flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-text-DEFAULT">Upload Donation Receipt</h2>
                                <Button variant="ghost" size="icon" onClick={handleCloseModal} className="text-text-light hover:bg-muted-DEFAULT">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-4">
                                <div className="grid gap-4">
                                    {/* Image Preview */}
                                    {imagePreviewUrl && (
                                        <div className="mb-4 rounded-md overflow-hidden">
                                            <img src={imagePreviewUrl} alt="Donation Receipt Preview" className="w-full h-auto" />
                                        </div>
                                    )}
                                    <div className="grid gap-2">
                                        <Label htmlFor="receipt" className="text-text-DEFAULT">
                                            Donation Receipt
                                        </Label>
                                        <Input id="receipt" type="file" accept="image/*" onChange={handleReceiptUpload} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="amount" className="text-text-DEFAULT">
                                            Donation Amount (PKR)
                                        </Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="Enter amount"
                                            value={donationAmount}
                                            onChange={handleAmountChange}
                                        />
                                    </div>
                                    <Button onClick={handleSubmitDonation} className="bg-primary-500 text-white hover:bg-primary-600">
                                        Submit Donation
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

export default DonateOnlinePage;