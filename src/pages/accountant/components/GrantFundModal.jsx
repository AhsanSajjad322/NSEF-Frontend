import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const GrantFundModal = ({ isOpen, selectedRequest, grantAmount, setGrantAmount, onClose, onApprove, isSubmitting = false }) => {
  if (!isOpen || !selectedRequest) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Grant Fund</h3>
        <p className="mb-2">Student: <span className="font-medium">{selectedRequest.studentName}</span></p>
        <p className="mb-2">Student ID: <span className="font-medium">{selectedRequest.studentId}</span></p>
        <p className="mb-4">Request Reason: <span className="font-medium">{selectedRequest.reason}</span></p>
        
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Requested Amount (PKR)</label>
          <p className="font-medium">{parseFloat(selectedRequest.amount).toLocaleString()}</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Amount to Grant (PKR)</label>
          <input 
            type="number" 
            value={grantAmount} 
            onChange={(e) => setGrantAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded" 
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onApprove} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Grant'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GrantFundModal;
