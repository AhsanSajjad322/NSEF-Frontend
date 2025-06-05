import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BadgeDollarSign, ArrowDownCircle, CalendarIcon } from 'lucide-react';
import { formatCurrency } from '../utils';

const TransactionHistoryTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Complete history of all financial movements</CardDescription>
      </CardHeader>      <CardContent>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="w-full xs:w-auto">
              All
            </Button>
            <Button variant="outline" size="sm" className="w-full xs:w-auto">
              Grants
            </Button>
            <Button variant="outline" size="sm" className="w-full xs:w-auto">
              Deposits
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full xs:w-auto justify-end mt-2 xs:mt-0">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by date</span>
          </div>
        </div>        {/* Mobile view for transaction history - Card-based layout optimized for small screens */}
        <div className="md:hidden space-y-4">
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium">TRX-2506-001</h3>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Completed
              </span>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <BadgeDollarSign className="h-4 w-4 text-red-500 mr-1" /> <span>Grant</span>
            </div>
            <p className="text-red-600 font-medium mt-1">-{formatCurrency(18000)}</p>
            <p className="text-sm text-muted-foreground mt-1">2025-06-04</p>
            <p className="text-sm mt-1">Fund granted to Abdullah Khan</p>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">TRX-2506-002</h3>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Completed
              </span>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowDownCircle className="h-4 w-4 text-green-500 mr-1" /> <span>Deposit</span>
            </div>
            <p className="text-green-600 font-medium mt-1">{formatCurrency(200000)}</p>
            <p className="text-sm text-muted-foreground mt-1">2025-06-03</p>
            <p className="text-sm mt-1">Cash deposit from NSFT</p>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">TRX-2506-003</h3>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Completed
              </span>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <BadgeDollarSign className="h-4 w-4 text-red-500 mr-1" /> <span>Grant</span>
            </div>
            <p className="text-red-600 font-medium mt-1">-{formatCurrency(30000)}</p>
            <p className="text-sm text-muted-foreground mt-1">2025-06-01</p>
            <p className="text-sm mt-1">Fund granted to Hamza Ali</p>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">TRX-2505-004</h3>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Completed
              </span>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowDownCircle className="h-4 w-4 text-green-500 mr-1" /> <span>Deposit</span>
            </div>
            <p className="text-green-600 font-medium mt-1">{formatCurrency(175000)}</p>
            <p className="text-sm text-muted-foreground mt-1">2025-05-31</p>
            <p className="text-sm mt-1">Cash deposit from NSFT</p>
          </div>
        </div>        {/* Desktop view for transaction history - Traditional table layout for larger screens */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">TRX-2506-001</TableCell>
                <TableCell>
                  <span className="flex items-center">
                    <BadgeDollarSign className="h-4 w-4 text-red-500 mr-1" /> Grant
                  </span>
                </TableCell>
                <TableCell className="text-red-600">-{formatCurrency(18000)}</TableCell>
                <TableCell>2025-06-04</TableCell>
                <TableCell>Fund granted to Abdullah Khan</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Completed
                  </span>
                </TableCell>
              </TableRow>
            <TableRow>
              <TableCell className="font-medium">TRX-2506-002</TableCell>
              <TableCell>
                <span className="flex items-center">
                  <ArrowDownCircle className="h-4 w-4 text-green-500 mr-1" /> Deposit
                </span>
              </TableCell>
              <TableCell className="text-green-600">{formatCurrency(200000)}</TableCell>
              <TableCell>2025-06-03</TableCell>
              <TableCell>Cash deposit from NSFT</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  Completed
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">TRX-2506-003</TableCell>
              <TableCell>
                <span className="flex items-center">
                  <BadgeDollarSign className="h-4 w-4 text-red-500 mr-1" /> Grant
                </span>
              </TableCell>
              <TableCell className="text-red-600">-{formatCurrency(30000)}</TableCell>
              <TableCell>2025-06-01</TableCell>
              <TableCell>Fund granted to Hamza Ali</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  Completed
                </span>
              </TableCell>
            </TableRow>            <TableRow>
              <TableCell className="font-medium">TRX-2505-004</TableCell>
              <TableCell>
                <span className="flex items-center">
                  <ArrowDownCircle className="h-4 w-4 text-green-500 mr-1" /> Deposit
                </span>
              </TableCell>
              <TableCell className="text-green-600">{formatCurrency(175000)}</TableCell>
              <TableCell>2025-05-31</TableCell>
              <TableCell>Cash deposit from NSFT</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  Completed
                </span>
              </TableCell>
            </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>      <CardFooter className="flex flex-wrap justify-between items-center gap-3">
        <span className="text-sm text-muted-foreground">Showing 4 of 200 transactions</span>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" disabled className="flex-1 sm:flex-initial">
            Previous
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransactionHistoryTab;
