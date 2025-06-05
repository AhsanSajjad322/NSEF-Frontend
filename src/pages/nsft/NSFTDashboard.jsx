import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Notification from '@/components/home/Notification';
import ActionCard from '@/components/home/ActionCard';
import { Link } from 'react-router-dom';
import { CheckCheck } from 'lucide-react'; // Using CheckCheck for Cash Receival Confirmation
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const NSFTDashboardPage = () => {
    const { userInfo } = useAuth(); // Use the useAuth hook

    // Extract user and userType details from userInfo
    const user = userInfo?.user;
    const userType = userInfo?.userType;

    const name = user ? `${user.first_name} ${user.last_name}` : 'N/A';
    const role = userType || 'N/A';

    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="text-sm text-text-light mb-4">
                    NSFT / <span className="font-semibold text-text-DEFAULT">Dashboard</span>
                </div>

                {/* NSFT Details Section */}
                <div className="bg-primary-800 text-white p-4 rounded-md shadow-sm mb-4">
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm">{role}</p>
                </div>

                <Notification message="Welcome NSFT Representative!" type="info" />

                {/* Actions Section */}
                <h2 className="text-md font-semibold text-text-DEFAULT mb-2">Actions</h2>
                <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                    <Link to="/nsft/cash-receival-confirmation">
                        <ActionCard bgColor="bg-secondary-500" title="Cash Receival Confirmation" icon={<CheckCheck className="h-6 w-6 text-accent-200" />} />
                    </Link>
                    {/* Only one action as per requirement */}
                </div>
            </div>
        </div>
    );
};

export default NSFTDashboardPage;