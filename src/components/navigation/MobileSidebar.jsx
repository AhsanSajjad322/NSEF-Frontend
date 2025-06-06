import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
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
import { useAuth } from '@/context/AuthContext';

// Define your menu structure
const menuItems = {
    'Personal': [
        { label: 'Dashboard', path: '/student/dashboard' },
        { label: 'Donate Online', path: '/student/donate-online' },
        // { label: 'Request Fund', path: '/student/request-fund' },
        { label: 'View Transaction', path: '/student/view-transactions' },
        // { label: 'Complaint/Feedback', path: '/student/complaint' },
        { label : 'Fund Request History', path: '/student/request-history' }
    ],
    'CR / NSFRep': [
        { label: 'Dashboard', path: '/cr/dashboard' },
        { label: 'Add Donation', path: '/cr/add-donation' },
        { label: 'Cash Transactions', path: '/cr/transactions' },
        { label: 'Cash Handovers', path: '/cr/cash-handovers' },
        { label: 'Verify Online Transaction', path: '/cr/verify-online-transaction' },
    ],
    'BP': [
        { label: 'Dashboard', path: '/bp/dashboard' },
        { label: 'Cash Handover', path: '/bp/cash-handovers' },
        { label: 'Cash Receival Confirmation', path: '/bp/cash-receival-confirmation' },
    ],
    'NSFT': [
        { label: 'Dashboard', path: '/nsft/dashboard' },
        { label: 'Cash Receival Confirmation', path: '/nsft/cash-receival-confirmation' },
    ],

    'Accountant': [
        { label: 'Dashboard', path: '/accountant' },
    ],
};

const allowedMenuRoles = (userType) => {
    if (!userType) return [];

    const lowerCaseUserType = userType.map((user)=>{
        return user.toLowerCase()
    });

    const finalRoles = []

    if (lowerCaseUserType.includes('student')){
        finalRoles.push('Personal');
    }
    if (lowerCaseUserType.includes('cr')){
        finalRoles.push('CR / NSFRep');
    }
    if (lowerCaseUserType.includes('bp')){
        finalRoles.push('BP');
    }
    if (lowerCaseUserType.includes('nsft')){
        finalRoles.push('NSFT');
    }
    return finalRoles;
};

export const MobileSidebar = ({ isOpen, onClose }) => {
    const { userType, logout } = useAuth();
    const accessibleRoles = allowedMenuRoles(userType);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side='left' className="sm:max-w-xs flex flex-col h-full bg-white">
                <SheetHeader className="border-b border-muted-DEFAULT">
                    <SheetTitle className="text-text-DEFAULT">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex-grow overflow-y-auto p-4">
                    <Accordion type="single" collapsible>
                        {accessibleRoles.map((role) => (
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
                <Button variant="outline" className="w-full bg-secondary-600 text-white hover:bg-secondary-50" onClick={logout}>
                    Sign Out
                </Button>
            </SheetContent>
        </Sheet>
    );
};