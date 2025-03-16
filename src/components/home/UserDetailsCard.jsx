import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const UserDetailsCard = ({ name, cms, bgColor }) => {
    return (
        <Card className={` ${bgColor} shadow-sm border border-muted-DEFAULT `}>
            <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2 text-white">User Details</h2>
                <p className="text-white"><strong>Name:</strong> {name}</p>
                <p className="text-white"><strong>CMS ID:</strong> {cms}</p>
            </CardContent>
        </Card>
    );
};

export default UserDetailsCard;