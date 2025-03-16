import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Notification from '@/components/home/Notification';
import ActionCard from '@/components/home/ActionCard';
import { Link } from 'react-router-dom';
import { Handshake, CheckCheck } from 'lucide-react'; // Using Handshake for Cash Handover and CheckCheck for Confirmation

const BPDashboardPage = () => {
    const bpData = {
        name: 'Batch President Name', // Replace with actual data
        batch: 'Batch 2021-2025', // Example batch information
        role: 'Batch President' // Role identifier
    };

    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="text-sm text-text-light mb-4">
                    BR / <span className="font-semibold text-text-DEFAULT">Dashboard</span>
                </div>

                {/* BP Details Section */}
                <div className="bg-primary-800 text-white p-4 rounded-md shadow-sm mb-4">
                    <p className="font-semibold">{bpData.name}</p>
                    <p className="text-sm">{bpData.batch}</p>
                    <p className="text-sm">{bpData.role}</p>
                </div>

                <Notification message="Welcome Batch President!" type="info" />

                {/* Actions Section */}
                <h2 className="text-md font-semibold text-text-DEFAULT mb-2">Actions</h2>
                <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <Link to="/bp/cash-handovers">
                        <ActionCard bgColor="bg-secondary-500" title="Cash Handover" icon={<Handshake className="h-6 w-6 text-primary-200" />} />
                    </Link>
                    <Link to="/bp/cash-receival-confirmation">
                        <ActionCard bgColor="bg-secondary-500" title="Cash Receival Confirmation" icon={<CheckCheck className="h-6 w-6 text-accent-200" />} />
                    </Link>
                    {/* You can add more actions here if needed */}
                </div>
            </div>
        </div>
    );
};

export default BPDashboardPage;