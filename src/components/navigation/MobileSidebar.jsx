import React from 'react';
import { X } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NavItem } from './NavItem';
import { Link } from 'react-router-dom';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// Define your menu structure
const menuItems = {
    Personal: [
        { label: 'Dashboard', path: '/student/dashboard' },
        { label: 'Donate Online', path: '/student/donate-online' },
        { label: 'Request Fund', path: '/student/request-fund' },
        { label: 'View Transaction', path: '/student/view-transactions' },
        { label: 'Complaint/Feedback', path: '/student/complaint' },
    ],
    CR: [
        { label: 'Dashboard', path: '/cr/dashboard' },
        { label: 'Transaction', path: '/cr/transactions' },
        { label: 'Verify Online Transaction', path: '/cr/verify-online-transaction' },
        { label: 'Cash Handovers', path: '/cr/cash-handovers' },
        // Add more CR pages
    ],
    NSFRep: [
        { label: 'Dashboard', path: '/nsfRep/dashboard' },
        { label: 'Home', path: '/nsfRep/home' },
        { label: 'Donate Online', path: '/nsfRep/donate-online' }, // Added for consistency
        { label: 'Request Fund', path: '/nsfRep/request-fund' },   // Added for consistency
        { label: 'View Transaction', path: '/nsfRep/view-transaction' }, // Added for consistency
    ],
    BR: [
        // Add BR pages
    ],
    NSF: [
        // Add NSF pages
    ],
};
export const MobileSidebar = ({ isOpen, onClose, userRoles }) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side='left' className="sm:max-w-xs flex flex-col h-full bg-white">
                <SheetHeader className="border-b border-muted-DEFAULT">
                    <SheetTitle className="text-text-DEFAULT">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex-grow overflow-y-auto p-4">
                    <Accordion type="single" collapsible>
                        {userRoles.map((role) => (
                            <AccordionItem key={role} value={role}>
                                <AccordionTrigger className="text-lg font-semibold text-primary-DEFAULT hover:bg-primary-100 rounded-md p-2 -mx-2">
                                    {role}
                                </AccordionTrigger>
                                <AccordionContent className="py-2">
                                    {menuItems[role] &&
                                        menuItems[role].map((item) => (
                                            <Link key={item.label} to={item.path} onClick={onClose}>
                                                <NavItem label={item.label} />
                                            </Link>
                                        ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                <Separator className="my-4 border-muted-DEFAULT" />
                <Button variant="outline" className="w-full bg-secondary-600 text-white hover:bg-secondary-50">
                    Sign Out
                </Button>
            </SheetContent>
        </Sheet>
    );
};