import React, { useState } from 'react';
import { MenuIcon, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MobileSidebar } from './MobileSidebar';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const currentRole = 'User';

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
                    NEFT | {currentRole}
                </div>
                <Avatar className="h-8 w-8">
                    <AvatarImage src="/assets/profile-placeholder.png" alt="User Profile" />
                    <AvatarFallback className="bg-accent-500 text-secondary-foreground">P</AvatarFallback>
                </Avatar>
            </div>
            <MobileSidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
        </div>
    );
};

export default Navbar;