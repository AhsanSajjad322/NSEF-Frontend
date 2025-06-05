import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowDownCircle, FileText } from 'lucide-react';

const RecentActivity = ({ recentActivity }) => {
return (
    <Card className="lg:col-span-2">
        <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest financial activities and approvals</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">                {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex flex-wrap items-center justify-between p-3 bg-muted/50 rounded-md gap-2">
                        <div className="flex items-center gap-3">
                            {(() => {                                
                                switch (activity.icon) {
                                    case 'CheckCircle':
                                        return <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />;
                                    case 'ArrowDownCircle':
                                        return <ArrowDownCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />;
                                    case 'XCircle':
                                        return <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />;
                                    default:
                                        return <FileText className="h-4 w-4 flex-shrink-0" />;
                                }
                            })()}
                            <div>
                                <p className="text-sm font-medium">{activity.details}</p>
                                <p className="text-xs text-muted-foreground">{activity.date}</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium capitalize px-2 py-1 rounded bg-muted">
                            {activity.type}
                        </span>
                    </div>
                ))}
            </div>
        </CardContent>
        <CardFooter>
            <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" /> View All Activities
            </Button>
        </CardFooter>
    </Card>
);
}

export default RecentActivity;
