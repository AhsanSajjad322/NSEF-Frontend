import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navigation/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fundRequestService } from '@/lib/api-client';
import { useToast } from '@/components/ui/use-toast';
import { Clock, Check, X, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const RequestHistory = () => {
    const [fundRequests, setFundRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    
    // In a real app, this would come from auth context
    const currentStudentId = 'STU-2023-015'; 

    useEffect(() => {
        const loadFundRequests = async () => {
            try {
                const requests = await fundRequestService.getStudentRequests(currentStudentId);
                setFundRequests(requests);
            } catch (error) {
                console.error("Error loading fund requests:", error);
                toast.error("Failed to load fund requests", {
                    description: "Please try again later."
                });
            } finally {
                setLoading(false);
            }
        };

        loadFundRequests();
    }, [toast]);

    const getStatusIcon = (status) => {
        switch(status) {
            case 'approved':
                return <Check className="h-5 w-5 text-green-500" />;
            case 'rejected':
                return <X className="h-5 w-5 text-red-500" />;
            default:
                return <Clock className="h-5 w-5 text-yellow-500" />;
        }
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        }
    };

    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="text-sm text-text-light mb-4">
                    Student / <span className="font-semibold text-text-DEFAULT">Fund Request History</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-light">Total Requests</p>
                                    <h3 className="text-2xl font-bold mt-1">{fundRequests.length || 0}</h3>
                                </div>
                                <FileText className="h-8 w-8 text-primary-500" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-light">Approved Requests</p>
                                    <h3 className="text-2xl font-bold mt-1">
                                        {fundRequests.filter(req => req.status === 'approved').length || 0}
                                    </h3>
                                </div>
                                <Check className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-light">Pending Requests</p>
                                    <h3 className="text-2xl font-bold mt-1">
                                        {fundRequests.filter(req => req.status === 'pending').length || 0}
                                    </h3>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-sm mb-6">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">Your Fund Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {loading ? (
                            <div className="text-center p-4">
                                <p>Loading your requests...</p>
                            </div>
                        ) : fundRequests.length === 0 ? (
                            <div className="text-center p-4 border border-dashed rounded-md">
                                <p className="text-sm text-text-light mb-4">You haven't made any fund requests yet.</p>
                                <Button 
                                    variant="outline" 
                                    asChild
                                >
                                    <Link to="/student/request-fund">
                                        Make Your First Request
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="text-left">
                                        <tr className="border-b border-muted-DEFAULT">
                                            <th className="pb-3 font-medium text-sm text-text-light">Request ID</th>
                                            <th className="pb-3 font-medium text-sm text-text-light">Date</th>
                                            <th className="pb-3 font-medium text-sm text-text-light">Amount</th>
                                            <th className="pb-3 font-medium text-sm text-text-light">Status</th>
                                            <th className="pb-3 font-medium text-sm text-text-light">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fundRequests.map(request => (
                                            <tr key={request.id} className="border-b border-muted-DEFAULT">
                                                <td className="py-3 text-sm">{request.id}</td>
                                                <td className="py-3 text-sm">{request.requestDate}</td>
                                                <td className="py-3 text-sm">PKR {request.amount.toLocaleString()}</td>
                                                <td className="py-3 text-sm">
                                                    <div className="flex items-center">
                                                        {getStatusIcon(request.status)}
                                                        <span className={`ml-2 px-2 py-1 text-xs rounded-full border ${getStatusClass(request.status)}`}>
                                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                        </span>
                                                    </div>
                                                </td>                                                <td className="py-3 text-sm">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-primary-500 p-0"
                                                        asChild
                                                    >
                                                        <Link to={`/student/fund-request/${request.id}`}>
                                                            View Details <ArrowRight className="ml-1 h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
                
                <div className="flex justify-end">
                    <Button 
                        className="bg-primary-500 text-white hover:bg-primary-600"
                    >
                        <Link to="/student/request-fund" className="flex items-center">
                            Submit New Request
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RequestHistory;
