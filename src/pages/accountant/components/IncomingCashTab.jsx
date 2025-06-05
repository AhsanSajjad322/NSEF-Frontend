import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '../utils';

const IncomingCashTab = ({ incomingCashTransactions, handleApproveIncomingCash }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incoming Cash for Approval</CardTitle>
        <CardDescription>Approve cash deposits from NSFT members</CardDescription>
      </CardHeader>      <CardContent>        {/* Mobile view for small screens */}
        <div className="md:hidden space-y-4">
          {incomingCashTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-muted/20 p-4 rounded-lg">
              <h3 className="font-medium text-lg break-words">{transaction.nsftMember}</h3>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-medium break-all">{formatCurrency(transaction.amount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p>{transaction.date}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Source</p>
                  <p className="break-words">{transaction.source}</p>
                </div>
              </div>
              <div className="mt-3 w-full">
                <Button onClick={() => handleApproveIncomingCash(transaction)} className="w-full sm:w-auto">
                  Approve Transaction
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Desktop view for larger screens */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NSFT Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomingCashTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.nsftMember}</TableCell>
                  <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.source}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => handleApproveIncomingCash(transaction)}>
                      Approve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomingCashTab;
