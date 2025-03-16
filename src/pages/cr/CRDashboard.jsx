// CRDashboardPage.jsx
import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Notification from '@/components/home/Notification';
import ActionCard from '@/components/home/ActionCard';
import { Link } from 'react-router-dom';
import { Coins, FileText, CheckCheck, Handshake, PlusCircle } from 'lucide-react';

const CRDashboardPage = () => {
    const crData = {
        name: 'Muhammad Ahsan Sajjad', 
        role: 'Class Representative'
    };

    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="text-sm text-text-light mb-4">
                    CR / <span className="font-semibold text-text-DEFAULT">Dashboard</span>
                </div>

                {/* CR Details Section */}
                <div className="bg-primary-800 text-white p-4 rounded-md shadow-sm mb-4">
                    <p className="font-semibold">{crData.name}</p>
                    <p className="text-sm">{crData.role}</p>
                </div>

                <Notification message="Welcome Class Representative!" type="info" />

                {/* Actions Section */}
                <h2 className="text-md font-semibold text-text-DEFAULT mb-2">Actions</h2>
                <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <Link to="/cr/transactions">
                        <ActionCard bgColor="bg-secondary-500" title="View Cash Transactions" icon={<FileText className="h-6 w-6 text-primary-200" />} />
                    </Link>
                    <Link to="/cr/verify-online-transaction">
                        <ActionCard bgColor="bg-secondary-500" title="Verify Online Transactions" icon={<CheckCheck className="h-6 w-6 text-accent-200" />} />
                    </Link>
                    <Link to="/cr/cash-handovers">
                        <ActionCard bgColor="bg-secondary-500" title="Cash Handovers" icon={<Handshake className="h-6 w-6 text-primary-200" />} />
                    </Link>
                    <Link to="/cr/add-donation">
                        <ActionCard bgColor="bg-secondary-500" title="Add Donation" icon={<PlusCircle className="h-6 w-6 text-accent-200" />} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CRDashboardPage;