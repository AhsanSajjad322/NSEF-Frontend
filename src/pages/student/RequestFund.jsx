import React, { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { fundRequestService } from '@/lib/api-client';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle2, Loader2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const RequestFundPage = () => {
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [successfulSubmission, setSuccessfulSubmission] = useState(null);
    const { toast } = useToast();
    
    // Basic form validation
    const validateForm = () => {
        const newErrors = {};
        
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount greater than 0';
        }
        
        if (!reason || reason.trim().length < 10) {
            newErrors.reason = 'Please provide a detailed reason (at least 10 characters)';
        }
        
        if (!bankName || bankName.trim() === '') {
            newErrors.bankName = 'Bank name is required';
        }
        
        if (!accountNumber || accountNumber.trim() === '') {
            newErrors.accountNumber = 'Account number is required';
        }
        
        if (!accountHolderName || accountHolderName.trim() === '') {
            newErrors.accountHolderName = 'Account holder name is required';
        }
        
        if (!contactNumber || contactNumber.trim() === '') {
            newErrors.contactNumber = 'Contact number is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setAmount('');
        setReason('');
        setBankName('');
        setAccountNumber('');
        setAccountHolderName('');
        setContactNumber('');
        setErrors({});
    };
    
    const createNewRequest = () => {
        setSuccessfulSubmission(null);
    };    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            toast.error('Please fix the errors in the form', {
                description: 'Some required information is missing or incorrect.'
            });
            return;
        }
        
        setIsSubmitting(true);
        
        const requestData = {
            amount: parseFloat(amount),
            reason,
            bankName,
            accountNumber,
            accountHolderName,
            contactNumber,
            requestDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            studentName: 'Current Student', // In a real app, this would come from auth context
            studentId: 'STU-2023-099', // In a real app, this would come from auth context
            status: 'pending'
        };
        
        try {
            const response = await fundRequestService.submitFundRequest(requestData);
            
            if (response.success) {
                toast.success('Fund request submitted successfully', {
                    description: 'Your request has been sent to NSFT for review.'
                });
                
                // Store successful submission details
                setSuccessfulSubmission(response.request);
                
                // Reset form
                resetForm();
            } else {
                toast.error('Failed to submit fund request', {
                    description: response.message || 'An error occurred. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error submitting fund request:', error);
            toast.error('Failed to submit fund request', {
                description: 'An unexpected error occurred. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <div className="text-sm text-text-light">
                        Personal / <span className="font-semibold text-text-DEFAULT">Request Fund</span>
                    </div>
                    <Link to="/student/request-history" className="text-sm text-primary-500 hover:text-primary-600 flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        View Request History
                    </Link>
                </div>

                {successfulSubmission ? (
                    <Card className="shadow-sm border border-muted-DEFAULT">
                        <CardContent className="p-4 sm:p-6">
                            <div className="mb-4 flex items-center">
                                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2" />
                                <h2 className="text-base sm:text-lg font-semibold text-text-DEFAULT">Fund Request Submitted Successfully</h2>
                            </div>
                            
                            <Alert className="mb-4 bg-green-50 border-green-200">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <AlertTitle>Success</AlertTitle>
                                <AlertDescription>
                                    Your fund request has been submitted and is pending approval.
                                </AlertDescription>
                            </Alert>
                            
                            <div className="space-y-3 mb-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                                    <p className="text-sm text-text-light">Request ID:</p>
                                    <p className="text-sm font-medium">{successfulSubmission.id}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                                    <p className="text-sm text-text-light">Amount:</p>
                                    <p className="text-sm font-medium">PKR {successfulSubmission.amount.toLocaleString()}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                                    <p className="text-sm text-text-light">Submission Date:</p>
                                    <p className="text-sm font-medium">{successfulSubmission.requestDate}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                                    <p className="text-sm text-text-light">Status:</p>
                                    <p className="text-sm font-medium">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            {successfulSubmission.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                                <Button 
                                    variant="outline"
                                    asChild
                                    className="w-full sm:w-auto"
                                >
                                    <Link to={`/student/fund-request/${successfulSubmission.id}`}>
                                        View Request Details
                                    </Link>
                                </Button>
                                <Button 
                                    onClick={createNewRequest}
                                    className="bg-primary-500 text-white hover:bg-primary-600 w-full sm:w-auto"
                                >
                                    Submit Another Request
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    /* Request Fund Form */
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
                                        className={errors.amount ? "border-red-500" : ""}
                                        required
                                    />
                                    {errors.amount && (
                                        <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                                    )}
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
                                        className={errors.reason ? "border-red-500" : ""}
                                        rows={4}
                                        required
                                    />
                                    {errors.reason && (
                                        <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
                                    )}
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
                                        className={errors.bankName ? "border-red-500" : ""}
                                        required
                                    />
                                    {errors.bankName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
                                    )}
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
                                        className={errors.accountNumber ? "border-red-500" : ""}
                                        required
                                    />
                                    {errors.accountNumber && (
                                        <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
                                    )}
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
                                        className={errors.accountHolderName ? "border-red-500" : ""}
                                        required
                                    />
                                    {errors.accountHolderName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.accountHolderName}</p>
                                    )}
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
                                        className={errors.contactNumber ? "border-red-500" : ""}
                                        required
                                    />
                                    {errors.contactNumber && (
                                        <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>
                                    )}
                                </div>
                                <Button 
                                    type="submit" 
                                    className="bg-primary-500 text-white hover:bg-primary-600"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : 'Submit Request'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default RequestFundPage;