// AddDonationPage.jsx
import React, { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Search, X } from 'lucide-react';

const itemsPerPage = 7;

const AddDonationPage = () => {
    const [students, setStudents] = useState([
        { id: 1, name: 'Ali Ahmed', cms: '368854', amountPaid: 25000, status: 'Paid' },
        { id: 2, name: 'Sara Khan', cms: '368853', amountPaid: 0, status: 'Unpaid' },
        { id: 3, name: 'Usman Ghani', cms: '368852', amountPaid: 30000, status: 'Paid' },
        { id: 4, name: 'Ayesha Siddiqui', cms: '368157', amountPaid: 0, status: 'Unpaid' },
        { id: 5, name: 'Bilal Raza', cms: '368857', amountPaid: 28000, status: 'Paid' },
        { id: 6, name: 'Fatima Ali', cms: '368655', amountPaid: 25000, status: 'Paid' },
        { id: 7, name: 'Hamza Khan', cms: '368856', amountPaid: 0, status: 'Unpaid' },
        { id: 8, name: 'Nimra Butt', cms: '368859', amountPaid: 32000, status: 'Paid' },
        { id: 9, name: 'Qasim Shah', cms: '362857', amountPaid: 0, status: 'Unpaid' },
        { id: 10, name: 'Sana Javed', cms: '265857', amountPaid: 27000, status: 'Paid' },
        { id: 11, name: 'Tahir Mehmood', cms: '168857', amountPaid: 0, status: 'Unpaid' },
        { id: 12, name: 'Uzma Khan', cms: '468857', amountPaid: 31000, status: 'Paid' },
        { id: 13, name: 'Waqas Ali', cms: '568857', amountPaid: 0, status: 'Unpaid' },
        { id: 14, name: 'Zainab Fatima', cms: '248439', amountPaid: 29000, status: 'Paid' },
        { id: 15, name: 'Yaseen Khan', cms: '238539', amountPaid: 0, status: 'Unpaid' },
        { id: 16, name: 'Kiran Malik', cms: '238639', amountPaid: 26000, status: 'Paid' },
        { id: 17, name: 'Ejaz Ahmed', cms: '238479', amountPaid: 0, status: 'Unpaid' },
        { id: 18, name: 'Sofia Hassan', cms: '274859', amountPaid: 30500, status: 'Paid' },
        { id: 19, name: 'Rehan Ali', cms: '928475', amountPaid: 0, status: 'Unpaid' },
        { id: 20, name: 'Amna Raza', cms: '927583', amountPaid: 27500, status: 'Paid' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
    const [donatingStudent, setDonatingStudent] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState('all');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset page on search
    };

    const openDonateModal = (student) => {
        setDonatingStudent(student);
        setDonationAmount('');
        setIsDonateModalOpen(true);
    };

    const closeDonateModal = () => {
        setIsDonateModalOpen(false);
        setDonatingStudent(null);
        setDonationAmount('');
    };

    const handleDonationAmountChange = (event) => {
        setDonationAmount(event.target.value);
    };

    const handleDonate = () => {
        if (donatingStudent) {
            const amountToAdd = parseFloat(donationAmount) || 0;
            const updatedStudents = students.map(student =>
                student.id === donatingStudent.id ? { ...student, amountPaid: student.amountPaid + amountToAdd, status: student.amountPaid + amountToAdd > 0 ? 'Paid' : 'Unpaid' } : student
            );
            setStudents(updatedStudents);
            closeDonateModal();
        }
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        setCurrentPage(1);
    };

    const filteredStudents = students.filter(student => {
        const searchLower = searchTerm.toLowerCase();
        return (
            student.name.toLowerCase().includes(searchLower) ||
            student.cms.toLowerCase().includes(searchLower)
        );
    }).filter(student => {
        if (filterStatus === 'all') return true;
        return student.status.toLowerCase() === filterStatus;
    });

    const indexOfLastStudent = currentPage * itemsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage(prev => prev < totalPages ? prev + 1 : prev);
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => prev > 1 ? prev - 1 : prev);
    };

    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="text-sm text-text-light mb-4">
                    CR / <span className="font-semibold text-text-DEFAULT">Add Donation</span>
                </div>

                {/* Search and Filters */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search by Name or CMS"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <Search className="absolute top-2.5 right-3 h-4 w-4 text-text-light" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label className="text-text-DEFAULT">Filter By:</Label>
                        <Button
                            variant={filterStatus === 'all' ? 'default' : 'outline'}
                            onClick={() => handleFilterChange('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={filterStatus === 'paid' ? 'default' : 'outline'}
                            onClick={() => handleFilterChange('paid')}
                        >
                            Paid
                        </Button>
                        <Button
                            variant={filterStatus === 'unpaid' ? 'default' : 'outline'}
                            onClick={() => handleFilterChange('unpaid')}
                        >
                            Unpaid
                        </Button>
                    </div>
                </div>

                {/* Student List */}
                <Card className="shadow-sm border border-muted-DEFAULT">
                    <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-4 text-text-DEFAULT">Student Details</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>CMS</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.cms}</TableCell>
                                        <TableCell>{student.status}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="icon" onClick={() => openDonateModal(student)}>
                                                Donate
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {currentStudents.length === 0 && filteredStudents.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4">No students found on this page.</TableCell>
                                    </TableRow>
                                )}
                                {filteredStudents.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4">No students match your search criteria.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {filteredStudents.length > itemsPerPage && (
                            <div className="flex justify-between items-center mt-4">
                                <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                                    Previous
                                </Button>
                                <span>{currentPage} of {totalPages}</span>
                                <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                    Next
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Donate Modal */}
                {isDonateModalOpen && donatingStudent && (
                    <div className="fixed px-3 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-md shadow-lg w-full max-w-md">
                            <div className="p-4 border-b border-muted-DEFAULT flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-text-DEFAULT">Donate Amount</h2>
                                <Button variant="ghost" size="icon" onClick={closeDonateModal} className="text-text-light hover:bg-muted-DEFAULT">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-4">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="donation-amount" className="text-text-DEFAULT">
                                            Enter Amount to Donate for {donatingStudent.name} (CMS: {donatingStudent.cms})
                                        </Label>
                                        <Input
                                            id="donation-amount"
                                            type="number"
                                            placeholder="Enter amount"
                                            value={donationAmount}
                                            onChange={handleDonationAmountChange}
                                        />
                                    </div>
                                    <Button onClick={handleDonate} className="bg-primary-500 text-white hover:bg-primary-600">
                                        Donate
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddDonationPage;