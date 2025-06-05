import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { fundRequestService } from '@/lib/api-client';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const FundRequestDetail = () => {
    const { requestId } = useParams();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const loadRequestDetails = async () => {
            try {
                // Use the new method to get fund request details by ID
                const requestData = await fundRequestService.getFundRequestById(parseInt(requestId));
                if (requestData) {
                    setRequest(requestData);
                } else {
                    toast.error("Request not found", {
                        description: "The requested fund application could not be found."
                    });
                    navigate('/student/request-history');
                }
            } catch (error) {
                console.error("Error loading fund request details:", error);
                toast.error("Failed to load request details", {
                    description: "Please try again later."
                });
            } finally {
                setLoading(false);
            }
        };

        if (requestId) {
            loadRequestDetails();
        }
    }, [requestId, toast, navigate]);

    const getStatusDetails = () => {
        switch(request?.status) {
            case 'approved':
                return { 
                    icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
                    color: 'bg-green-100 text-green-800 border-green-300',
                    message: 'Your request has been approved!'
                };
            case 'rejected':
                return { 
                    icon: <XCircle className="h-6 w-6 text-red-500" />,
                    color: 'bg-red-100 text-red-800 border-red-300',
                    message: 'Your request was not approved.'
                };
            default:
                return { 
                    icon: <Clock className="h-6 w-6 text-yellow-500" />,
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                    message: 'Your request is being reviewed.'
                };
        }
    };

    const formatDate = (dateString) => {
        try {
            // Parse the date string and format it
            return format(new Date(dateString), 'PPP');
        } catch (error) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="bg-background-DEFAULT min-h-screen">
                <Navbar />
                <div className="container mx-auto p-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        <span className="ml-2">Loading request details...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="bg-background-DEFAULT min-h-screen">
                <Navbar />
                <div className="container mx-auto p-4">
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                                <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                                <h2 className="text-lg font-semibold">Request Not Found</h2>
                            </div>
                            <p className="mb-4">We couldn't find the requested fund application.</p>
                            <Button onClick={() => navigate('/student/request-history')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Request History
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const statusDetails = getStatusDetails();

    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-text-light">
                        <span className="cursor-pointer hover:text-primary-500" onClick={() => navigate('/student')}>Personal</span> / 
                        <span className="cursor-pointer hover:text-primary-500 ml-1" onClick={() => navigate('/student/request-history')}>Request History</span> / 
                        <span className="font-semibold text-text-DEFAULT ml-1">Request #{requestId}</span>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/student/request-history')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to All Requests
                    </Button>
                </div>

                <Card className="shadow-sm mb-6">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">Fund Request #{request.id}</CardTitle>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusDetails.color}`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center mb-6">
                            {statusDetails.icon}
                            <p className="ml-2">{statusDetails.message}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-md font-medium mb-3">Request Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <p className="text-sm text-text-light">Amount Requested:</p>
                                        <p className="text-sm font-medium">PKR {request.amount.toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-text-light">Request Date:</p>
                                        <p className="text-sm font-medium">{formatDate(request.requestDate)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-text-light">Student Name:</p>
                                        <p className="text-sm font-medium">{request.studentName}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-text-light">Student ID:</p>
                                        <p className="text-sm font-medium">{request.studentId}</p>
                                    </div>
                                </div>
                                
                                <Separator className="my-4" />
                                
                                <h3 className="text-md font-medium mb-3">Reason for Request</h3>
                                <p className="text-sm bg-muted-100 p-3 rounded-md">{request.reason}</p>
                            </div>
                            
                            <div>
                                <h3 className="text-md font-medium mb-3">Payment Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <p className="text-sm text-text-light">Bank Name:</p>
                                        <p className="text-sm font-medium">{request.bankName}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-text-light">Account Number:</p>
                                        <p className="text-sm font-medium">{request.accountNumber}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-text-light">Account Holder:</p>
                                        <p className="text-sm font-medium">{request.accountHolderName}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-text-light">Contact Number:</p>
                                        <p className="text-sm font-medium">{request.contactNumber}</p>
                                    </div>
                                </div>
                                
                                {request.status === 'approved' && (
                                    <>
                                        <Separator className="my-4" />
                                        
                                        <div className="bg-green-50 p-4 rounded-md border border-green-200">
                                            <h3 className="text-md font-medium text-green-800 mb-2">Approved Information</h3>
                                            <p className="text-sm text-green-700">Your request has been approved and the funds will be processed soon. 
                                            Please allow 2-3 business days for the transfer to complete.</p>
                                        </div>
                                    </>
                                )}
                                
                                {request.status === 'rejected' && request.comments && (
                                    <>
                                        <Separator className="my-4" />
                                        
                                        <div className="bg-red-50 p-4 rounded-md border border-red-200">
                                            <h3 className="text-md font-medium text-red-800 mb-2">Rejection Reason</h3>
                                            <p className="text-sm text-red-700">{request.comments || "No additional information provided."}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        {request.status === 'pending' && (
                            <div className="mt-6 flex justify-end">
                                <Button 
                                    variant="outline" 
                                    className="text-red-500 border-red-300 hover:bg-red-50"
                                >
                                    Cancel Request
                                </Button>
                            </div>
                        )}
                        
                        {request.status === 'rejected' && (
                            <div className="mt-6 flex justify-end">
                                <Button 
                                    className="bg-primary-500 text-white hover:bg-primary-600"
                                    onClick={() => navigate('/student/request-fund')}
                                >
                                    Create New Request
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FundRequestDetail;
