import React, { useState } from 'react';
import { MenuIcon, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MobileSidebar } from './MobileSidebar';
import { useAuth } from '@/context/AuthContext'; // Assuming AuthContext provides user info

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { userInfo } = useAuth(); // Get userInfo from auth context

    // Determine the role display text and fallback initial based on user's groups
    let roleDisplayText = 'User';
    let fallbackInitial = 'U';

    if (userInfo && userInfo.user && userInfo.user.groups) {
        const groups = userInfo.user.groups.map(group => group.toLowerCase()); // Convert groups to lowercase for consistent checking

        if (groups.includes('nsft')) {
            roleDisplayText = 'NSFT';
            fallbackInitial = 'T';
        } else if (groups.includes('bp')) {
            roleDisplayText = 'BP';
            fallbackInitial = 'BP';
        } else if (groups.includes('cr')) {
            roleDisplayText = 'CR';
            fallbackInitial = 'CR';
        } else if (groups.includes('student')) {
            roleDisplayText = 'Personal';
            fallbackInitial = 'P';
        }
        // If none of the specific roles are found, it will default to 'User' and 'U'
    }

    const handleOpenSidebar = () => {
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="sticky top-0 bg-card-DEFAULT z-50 shadow-sm border-b border-muted-DEFAULT">
            <div className="container mx-auto p-4 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={handleOpenSidebar} className="text-primary-DEFAULT hover:bg-primary-100">
                    <MenuIcon className="h-6 w-6" />
                </Button>
                <div className="text-center font-semibold text-sm md:text-base text-text-DEFAULT">
                    NEFT | {roleDisplayText}
                </div>
                <Avatar className="h-8 w-8">
                    <AvatarImage src="/assets/profile-placeholder.png" alt="User Profile" />
                    <AvatarFallback className="bg-accent-500 text-secondary-foreground">{fallbackInitial}</AvatarFallback>
                </Avatar>
            </div>
            <MobileSidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
        </div>
    );
};

export default Navbar;