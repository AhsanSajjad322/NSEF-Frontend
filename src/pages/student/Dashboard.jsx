import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Notification from '@/components/home/Notification';
import ActionCard from '@/components/home/ActionCard';
import { Link } from 'react-router-dom';
import { Coins, AlertTriangle, Handshake, FileText } from 'lucide-react';

const HomePage = () => {
    const userData = {
        name: 'Ahsan Sajjad',
        cms: '368857',
        class: "BESE 12-A"
    };

    const recentActivity = [
        { name: 'Aslam Ali', details: 'PKR 2,500 ↓' },
        { name: 'NSF Repr. 2012893', details: 'PKR 2,45,500 ↑' },
        { name: 'Nadir Shahbaz', details: 'PKR 2,500 ↓' },
    ];

    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="text-sm text-text-light mb-4">
                    Personal / <span className="font-semibold text-text-DEFAULT">Dashboard</span>
                </div>

                {/* User Details Section */}
                <div className="bg-primary-800 text-white p-4 rounded-md shadow-sm mb-4">
                    <p className="font-semibold">{userData.name}</p>
                    <p className="text-sm">{userData.cms}</p>
                    <p className="text-sm">{userData.class}</p>
                </div>


                <Notification message="Welcome to your student portal!" type="info" />

                {/* Recent Activity Section */}
                <div className="bg-card-DEFAULT rounded-md shadow-sm mb-4">
                    <h2 className="text-md font-semibold text-text-DEFAULT mb-2">Recent Activity</h2>
                    <ul >
                        {recentActivity.map((activity, index) => (
                            <li key={index} className="bg-accent-100 mb-2 p-2 border-b border-muted-DEFAULT rounded-md last:border-b-0 flex justify-between items-center">
                                <span className="text-sm text-text-DEFAULT">{activity.name}</span>
                                <span className="text-sm text-text-DEFAULT">{activity.details}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Actions Section */}
                <h2 className="text-md font-semibold text-text-DEFAULT mb-2">Actions</h2>
                <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <Link to="/student/donate-online">
                        <ActionCard bgColor="bg-secondary-500" title="Donate Online" icon={<Coins className="h-6 w-6 text-primary-200" />} />
                    </Link>
                    <Link to="/student/complaint">
                        <ActionCard bgColor="bg-secondary-500" title="Complaint" icon={<AlertTriangle className="h-6 w-6 text-accent-200" />} />
                    </Link>
                    <Link to="/student/request-fund">
                        <ActionCard bgColor="bg-secondary-500" title="Request Fund" icon={<Handshake className="h-6 w-6 text-primary-200" />} />
                    </Link>
                    <Link to="/student/view-transactions">
                        <ActionCard bgColor="bg-secondary-500" title="View Transaction" icon={<FileText className="h-6 w-6 text-accent-200" />} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;