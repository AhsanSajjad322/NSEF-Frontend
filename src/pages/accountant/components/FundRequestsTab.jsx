import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '../utils';
import { fundRequestService } from '../../../lib/api-client';
import { Loader2 } from 'lucide-react';


const FundRequestsTab = ({ handleGrantFund, handleRejectRequest }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingRequestIds, setProcessingRequestIds] = useState([]);
  
  const fetchPendingRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const requests = await fundRequestService.getNSFTApprovedRequests();
      setPendingRequests(requests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);
  
  // Wrap the original handlers to track processing state and refresh the list
  const handleGrantFundWrapper = async (request) => {
    setProcessingRequestIds(prev => [...prev, request.id]);
    try {
      await handleGrantFund(request);
      // After the action completes, refresh the list
      await fetchPendingRequests();
    } finally {
      setProcessingRequestIds(prev => prev.filter(id => id !== request.id));
    }
  };
  
  const handleRejectRequestWrapper = async (request) => {
    setProcessingRequestIds(prev => [...prev, request.id]);
    try {
      await handleRejectRequest(request);
      // After the action completes, refresh the list
      await fetchPendingRequests();
    } finally {
      setProcessingRequestIds(prev => prev.filter(id => id !== request.id));
    }
  };
  
  const isProcessing = (requestId) => {
    return processingRequestIds.includes(requestId);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Student Fund Requests</CardTitle>
        <CardDescription>Review and approve student requests for financial assistance</CardDescription>
      </CardHeader>      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500 mr-2" />
            <p>Loading fund requests...</p>
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-md">
            <p className="text-text-light">No pending fund requests available</p>
          </div>
        ) : (
          <>
            {/* Mobile cards view for smaller screens */}
            <div className="md:hidden space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="bg-muted/20 p-4 rounded-lg">
                  <h3 className="font-medium text-lg">{request.studentName}</h3>              
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">CMS ID</p>
                      <p className="break-all">{request.studentId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium break-all">{formatCurrency(request.amount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p>{request.requestDate}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Reason</p>
                      <p className="break-words">{request.reason}</p>
                    </div>
                    {request.approvedByNSFT && (
                      <div className="col-span-2 mt-1">
                        <Badge className="bg-green-100 text-green-800 border-green-300">Approved by NSFT</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button 
                      size="sm" 
                      className="flex-1" 
                      onClick={() => handleGrantFundWrapper(request)}
                      disabled={isProcessing(request.id)}
                    >
                      {isProcessing(request.id) ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          Processing...
                        </>
                      ) : 'Grant'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="flex-1" 
                      onClick={() => handleRejectRequestWrapper(request)}
                      disabled={isProcessing(request.id)}
                    >
                      {isProcessing(request.id) ? 'Processing...' : 'Reject'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}        {/* Regular table view for larger screens */}
        {!isLoading && pendingRequests.length > 0 && (
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>CMS ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request) => (                
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.studentName}
                      {request.approvedByNSFT && (
                        <div className="mt-1">
                          <Badge className="bg-green-100 text-green-800 border-green-300">Approved by NSFT</Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{request.studentId}</TableCell>
                    <TableCell>{formatCurrency(request.amount)}</TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleGrantFundWrapper(request)}
                          disabled={isProcessing(request.id)}
                        >
                          {isProcessing(request.id) ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              Processing...
                            </>
                          ) : 'Grant'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleRejectRequestWrapper(request)}
                          disabled={isProcessing(request.id)}
                        >
                          {isProcessing(request.id) ? 'Processing...' : 'Reject'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FundRequestsTab;
