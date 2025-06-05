import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart4, PiggyBank, ArrowDownCircle, BadgeDollarSign, BanknoteIcon } from 'lucide-react';
import { formatCurrency } from '../utils';

const FinancialSummary = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
        <CardDescription>Month of June 2025</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <PiggyBank className="mr-2 h-4 w-4 text-primary-500 flex-shrink-0" />
            <span className="text-sm">Opening Balance</span>
          </div>
          <span className="font-medium">{formatCurrency(2350000)}</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <ArrowDownCircle className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-sm">Deposits</span>
          </div>
          <span className="font-medium text-green-600">{formatCurrency(375000)}</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <BadgeDollarSign className="mr-2 h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="text-sm">Disbursements</span>
          </div>
          <span className="font-medium text-red-600">{formatCurrency(225000)}</span>
        </div>
        <div className="pt-2 border-t">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center">
              <BanknoteIcon className="mr-2 h-4 w-4 text-primary-700 flex-shrink-0" />
              <span className="text-sm font-semibold">Current Balance</span>
            </div>
            <span className="font-bold break-all">{formatCurrency(2500000)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <BarChart4 className="mr-2 h-4 w-4" /> Full Financial Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FinancialSummary;
