import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navigation/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Copy } from 'lucide-react';

const DonateOnlinePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [donationReceipt, setDonationReceipt] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [bankDetails, setBankDetials] = useState({
        bankName: '',
        accountNumber: '',
        holderName: ''
    })

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const getToken = ()=>{
        return localStorage.getItem('access_token');
    }

    const bankMappings = {
        "hbl": "Habib Bank Limited",
        "meezan": "Meezan Bank Limited",
        "easypaisa": "EasyPaisa",
        "jazzcash": "JazzCash",
        "sadapay": "Sadapay"
    }

    const fetchBankdetails = async()=>{
        try{
            const token = getToken();
            if (!token) {
                setError('Authentication token not found.');
                setLoading(false);
                return;
            }
            const fetchAccountResponse = await fetch(`${BACKEND_URL}/fund_tracking/banks/1`, {
                headers: {'Authorization': `Bearer ${token}`,}
            });
            const fetchAccount = await fetchAccountResponse.json(); 
    
            const bankName = bankMappings[fetchAccount.bank];
    
            setBankDetials({
                accountNumber: fetchAccount.account_number || '',
                bankName : bankName || '',
                holderName : fetchAccount.account_title || ''
            })
        }catch (error) {
            console.error('Error submitting donation:', error);
        }
    }
    useEffect(()=>{
        fetchBankdetails()
    },[])

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setError(''); // Clear any previous errors
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setDonationReceipt(null);
        setDonationAmount('');
        setImagePreviewUrl(null);
        setError('');
        setLoading(false);
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

    const handleSubmitDonation = async() => {
        if (!donationReceipt || !donationAmount) {
            setError('Please provide both donation amount and receipt.');
            return;
        }

        setLoading(true);
        setError('');

        const token = getToken();
        if (!token) {
            setError('Authentication token not found.');
            setLoading(false);
            return;
        }

        try {
            // First, create the transaction
            const createTransaction = await fetch(`${BACKEND_URL}/fund_tracking/transactions/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: donationAmount,
                    mode: "online",
                })
            });

            if (!createTransaction.ok) {
                throw new Error('Failed to create transaction');
            }

            const createTransactionResponse = await createTransaction.json();
            const transactionId = createTransactionResponse.id;

            // Then, upload the file using FormData
            const formData = new FormData();
            formData.append('transaction_id', transactionId);
            formData.append('image', donationReceipt); 

            const fundTracking = await fetch(`${BACKEND_URL}/fund_tracking/screenshots/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData 
            });

            if (!fundTracking.ok) {
                throw new Error('Failed to upload receipt', fundTracking);
            }

            const fundTrackingResponse = await fundTracking.json();
            console.log('Fund tracking response:', fundTrackingResponse);
            
            // Success - close modal and show success message
            handleCloseModal();

        } catch (error) {
            console.error('Error submitting donation:', error);
            setError('An error occurred while submitting the donation.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(bankDetails.accountNumber);
            setCopySuccess('Account number copied!');
            setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setCopySuccess('Failed to copy');
            setTimeout(() => setCopySuccess(''), 2000);
        }
    };

    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="text-sm text-text-light mb-4">
                    Personal / <span className="font-semibold text-text-DEFAULT">Donate Online</span>
                </div>

                {/* Bank Account Information */}
                <Card className="shadow-sm border border-muted-DEFAULT mb-4 bg-primary-700">
                    <CardContent className="p-4">
                        <h2 className="text-xl font-semibold mb-2 text-white">Bank Account Information</h2>
                        <p className="text-white">
                            <strong>Bank:</strong> {bankDetails.bankName}
                        </p>
                        <div className="flex items-center space-x-2">
                            <p className="text-white">
                                <strong>Account Number:</strong> {bankDetails.accountNumber}
                            </p>
                            <Button variant="ghost" size="icon" onClick={copyToClipboard} className="text-white hover:bg-primary-600">
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-white">
                            <strong>Account Name:</strong> {bankDetails.holderName}
                        </p>
                        {copySuccess && <p className="mt-2 text-green-300">{copySuccess}</p>}
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
                                {error && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                        {error}
                                    </div>
                                )}
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
                                    <Button 
                                        onClick={handleSubmitDonation} 
                                        disabled={loading}
                                        className="bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Donation'}
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