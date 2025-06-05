import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navigation/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { fundRequestService } from '@/lib/api-client';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Initial mock data for fund requests - Will be replaced by API call
const mockFundRequests = [
  {
    id: 1,
    studentName: 'Ahmed Khan',
    studentId: 'STU-2023-001',
    amount: 15000,
    reason: 'Tuition fee payment for the current semester',
    requestDate: '2025-05-28',
    bankName: 'HBL',
    accountNumber: '1234-5678-9012',
    accountHolderName: 'Ahmed Khan',
    contactNumber: '0300-1234567',
    status: 'pending'
  },
  {
    id: 2,
    studentName: 'Sara Ali',
    studentId: 'STU-2023-015',
    amount: 8000,
    reason: 'Course materials and books purchase',
    requestDate: '2025-05-29',
    bankName: 'MCB',
    accountNumber: '9876-5432-1098',
    accountHolderName: 'Sara Ali',
    contactNumber: '0300-7654321',
    status: 'pending'
  },
  {
    id: 3,
    studentName: 'Bilal Ahmed',
    studentId: 'STU-2023-042',
    amount: 20000,
    reason: 'Emergency medical expenses',
    requestDate: '2025-05-30',
    bankName: 'UBL',
    accountNumber: '5678-1234-5678',
    accountHolderName: 'Bilal Ahmed',
    contactNumber: '0333-1234567',
    status: 'pending'
  }
];

const FundRequestsPage = () => {
  const [fundRequests, setFundRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [comments, setComments] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchFundRequests = async () => {
      setIsLoading(true);
      try {
        const requests = await fundRequestService.getAllFundRequests();
        setFundRequests(requests);
      } catch (error) {
        console.error('Error fetching fund requests:', error);
        toast.error('Failed to load fund requests', {
          description: 'Please try refreshing the page.'
        });
        // Fallback to mock data if API fails
        setFundRequests(mockFundRequests);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFundRequests();
  }, [toast]);

  const handleView = (request) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const handleAction = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setIsActionDialogOpen(true);
  };  const handleActionSubmit = async () => {
    try {
      // Call API to update status
      const response = await fundRequestService.updateFundRequestStatus(
        selectedRequest.id, 
        actionType, 
        comments
      );
      
      if (response.success) {
        // Update the local state
        const updatedRequests = fundRequests.map(request => {
          if (request.id === selectedRequest.id) {
            return {
              ...request,
              status: actionType,
              comments: comments,
              approvedByNSFT: actionType === 'approved'
            };
          }
          return request;
        });

        setFundRequests(updatedRequests);
        setComments('');
        setIsActionDialogOpen(false);
        
        // Show success message
        toast.success(
          actionType === 'approved' 
            ? 'Request approved successfully' 
            : 'Request rejected successfully',
          {
            description: actionType === 'approved' 
              ? 'The request has been forwarded to the accountant and the student will be notified.' 
              : 'The student will be notified about the rejection.'
          }
        );
      } else {
        toast.error('Failed to process request', {
          description: response.message || 'Please try again.'
        });
      }
    } catch (error) {
      console.error('Error updating fund request status:', error);
      toast.error('Failed to process request', {
        description: 'An unexpected error occurred. Please try again.'
      });
    }
  };
  const filteredRequests = fundRequests.filter(request => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = (
      request.studentName.toLowerCase().includes(searchTermLower) ||
      request.studentId.toLowerCase().includes(searchTermLower) ||
      request.reason.toLowerCase().includes(searchTermLower)
    );
    
    // Filter by status tab
    if (activeTab === 'all') {
      return matchesSearch;
    } else if (activeTab === 'pending') {
      return matchesSearch && request.status === 'pending';
    } else if (activeTab === 'approved') {
      return matchesSearch && request.status === 'approved';
    } else if (activeTab === 'rejected') {
      return matchesSearch && request.status === 'rejected';
    }
    
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
    }
  };

  return (
    <div className="bg-background-DEFAULT min-h-screen">
      <Navbar />      <div className="container mx-auto p-4">
        {/* Breadcrumb */}
        <div className="text-sm text-text-light mb-4">
          NSFT / <span className="font-semibold text-text-DEFAULT">Fund Requests</span>
        </div>

        {/* Fund Requests Card */}
        <Card className="shadow-sm border border-muted-DEFAULT">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-lg font-semibold text-text-DEFAULT">Student Fund Requests</h2>
              <div className="w-full md:w-1/3">
                <Input
                  placeholder="Search by name, ID or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Status Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Requests</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>            {isLoading ? (
              <div className="text-center py-8 text-text-light">
                Loading fund requests...
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-text-light">
                No fund requests found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Amount (PKR)</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.studentName}</TableCell>
                        <TableCell>{request.studentId}</TableCell>
                        <TableCell>{request.amount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleView(request)}
                            >
                              View
                            </Button>
                            {request.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-green-600 hover:text-green-700"
                                  onClick={() => handleAction(request, 'approved')}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleAction(request, 'rejected')}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
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
      </div>

      {/* View Request Dialog */}
      {selectedRequest && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Fund Request Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Student Name:</div>
                <div>{selectedRequest.studentName}</div>
                
                <div className="font-medium">Student ID:</div>
                <div>{selectedRequest.studentId}</div>
                
                <div className="font-medium">Amount Requested:</div>
                <div>PKR {selectedRequest.amount.toLocaleString()}</div>
                
                <div className="font-medium">Request Date:</div>
                <div>{new Date(selectedRequest.requestDate).toLocaleDateString()}</div>
                
                <div className="font-medium">Status:</div>
                <div>{getStatusBadge(selectedRequest.status)}</div>
                
                <div className="font-medium">Bank Name:</div>
                <div>{selectedRequest.bankName}</div>
                
                <div className="font-medium">Account Number:</div>
                <div>{selectedRequest.accountNumber}</div>
                
                <div className="font-medium">Account Holder:</div>
                <div>{selectedRequest.accountHolderName}</div>
                
                <div className="font-medium">Contact Number:</div>
                <div>{selectedRequest.contactNumber}</div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Reason for Request:</div>
                <div className="p-2 bg-muted rounded">{selectedRequest.reason}</div>
              </div>
              
              {selectedRequest.comments && (
                <div>
                  <div className="font-medium mb-1">Comments:</div>
                  <div className="p-2 bg-muted rounded">{selectedRequest.comments}</div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Action Dialog (Approve/Reject) */}
      {selectedRequest && (
        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {actionType === 'approved' ? 'Approve Fund Request' : 'Reject Fund Request'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'approved' 
                  ? 'This request will be sent to the accountant for processing after approval.'
                  : 'Please provide a reason for rejecting this fund request.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <div className="font-medium mb-2">Request from {selectedRequest.studentName}</div>
                <div className="text-sm text-text-light mb-1">Amount: PKR {selectedRequest.amount.toLocaleString()}</div>
                <div className="text-sm text-text-light">Reason: {selectedRequest.reason}</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  placeholder={actionType === 'approved' ? 'Add any approval notes (optional)' : 'Reason for rejection'}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  required={actionType === 'rejected'}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleActionSubmit}
                className={actionType === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {actionType === 'approved' ? 'Approve' : 'Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FundRequestsPage;
