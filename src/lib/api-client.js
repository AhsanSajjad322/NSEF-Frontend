import axios from "axios";
import { HOST } from "@/utils/constants";
import requests from './requests.json';

export const apiClient = axios.create({
    baseURL: HOST,
});

var requestsStore = {
    
    getAll() {
        return requests;
    },
    
    getById(id) {
        return requests.find(req => req.id === id);
    },
    
    getByStatus(status) {
        return requests.filter(req => req.status === status);
    },
    
    getApprovedByNSFT() {
        return requests.filter(req => req.approvedByNSFT === true);
    },
    
    add(requestData) {
        const newId = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1;
        const newRequest = {
            id: newId,
            ...requestData,
            requestDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            approvedByNSFT: false
        };
        requests.push(newRequest);
        console.log('New fund request added:', newRequest);
        return newRequest;
    },
    
    update(id, updates) {
        const index = requests.findIndex(req => req.id === id);
        if (index !== -1) {
            requests[index] = { ...requests[index], ...updates };
            return requests[index];
        }
        return null;
    }
};

// Fund Request Services
export const fundRequestService = {
    // Student services
    submitFundRequest: (requestData) => {
        console.log('Submitting fund request:', requestData);
        const newRequest = requestsStore.add(requestData);
        return Promise.resolve({ success: true, message: 'Fund request submitted successfully', request: newRequest });
    },
      getStudentRequests: (studentId) => {
        const studentRequests = requests.filter(req => req.studentId === studentId);
        return Promise.resolve(studentRequests);
    },
    
    getFundRequestById: (requestId) => {
        const request = requestsStore.getById(requestId);
        return Promise.resolve(request);
    },
    
    // NSFT services
    getAllFundRequests: () => {
        return Promise.resolve(requestsStore.getAll());
    },
    
    updateFundRequestStatus: (requestId, status, comments) => {
        console.log('Updating fund request status:', { requestId, status, comments });
        const updatedRequest = requestsStore.update(requestId, { 
            status, 
            comments, 
            approvedByNSFT: status === 'approved' ? true : false 
        });
        
        if (updatedRequest) {
            return Promise.resolve({ success: true, message: `Fund request ${status} successfully`, request: updatedRequest });
        }
        return Promise.resolve({ success: false, message: 'Request not found' });
    },
      // Accountant services
    getNSFTApprovedRequests: () => {
        return Promise.resolve(requestsStore.getApprovedByNSFT());
    },
    
    // Function for accountant to approve and grant fund
    grantFundRequest: (requestId, amount, transferDetails) => {
        console.log('Granting fund request:', { requestId, amount, transferDetails });
        const updatedRequest = requestsStore.update(requestId, { 
            status: 'granted',
            grantedAmount: amount,
            transferDetails,
            grantedDate: new Date().toISOString().split('T')[0]
        });
        
        if (updatedRequest) {
            return Promise.resolve({ 
                success: true, 
                message: 'Fund granted successfully', 
                request: updatedRequest 
            });
        }
        return Promise.resolve({ success: false, message: 'Request not found' });
    },
    
    // Function for accountant to reject a fund request
    rejectFundRequest: (requestId, reason) => {
        console.log('Rejecting fund request by accountant:', { requestId, reason });
        const updatedRequest = requestsStore.update(requestId, { 
            status: 'rejected',
            rejectionReason: reason,
            rejectedDate: new Date().toISOString().split('T')[0],
            rejectedBy: 'accountant'
        });
        
        if (updatedRequest) {
            return Promise.resolve({ 
                success: true, 
                message: 'Fund request rejected successfully', 
                request: updatedRequest 
            });
        }
        return Promise.resolve({ success: false, message: 'Request not found' });
    }
};
