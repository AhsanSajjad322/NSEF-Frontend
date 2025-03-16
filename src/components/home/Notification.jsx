import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Notification = ({ message, type = 'info', duration = 5000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleCloseNotification = ()=>{
        setIsVisible(false)
    }

    useEffect(() => {
        if (message && duration) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration]);

    if (!isVisible || !message) {
        return null;
    }

    let alertTypeClasses = '';
    let iconColor = 'text-primary-DEFAULT';
    let textColor = 'text-text-DEFAULT';

    switch (type) {
        case 'success':
            alertTypeClasses = 'bg-green-100 border-green-300';
            iconColor = 'text-green-500';
            break;
        case 'warning':
            alertTypeClasses = 'bg-yellow-100 border-yellow-300';
            iconColor = 'text-yellow-500';
            break;
        case 'error':
            alertTypeClasses = 'bg-secondary-100 border-secondary-300';
            iconColor = 'text-secondary-500';
            break;
        default:
            alertTypeClasses = 'bg-primary-100 border-primary-300';
            iconColor = 'text-primary-DEFAULT';
    }

    return (
        <Alert className={`mt-4 border-l-4 ${alertTypeClasses}`}>
            <XCircle className={`h-4 w-4 ${iconColor}`} onClick={handleCloseNotification}/>
            <AlertTitle className={textColor}>Notification</AlertTitle>
            <AlertDescription className="text-text-light">{message}</AlertDescription>
        </Alert>
    );
};

export default Notification;