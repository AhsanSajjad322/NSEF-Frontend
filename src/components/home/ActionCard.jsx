import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ActionCard = ({ title, icon, bgColor }) => {
    return (
        <Card className={`${bgColor} shadow-sm border border-muted-DEFAULT cursor-pointer hover:shadow-md transition duration-200 flex flex-col h-full`}> {/* Added h-full */}
            <CardContent className="flex flex-col items-center justify-center p-6 flex-grow">
                <div className="mb-2">{icon}</div>
                <h3 className="text-md font-semibold text-center text-text-DEFAULT text-white">{title}</h3>
            </CardContent>
        </Card>
    );
};

export default ActionCard;