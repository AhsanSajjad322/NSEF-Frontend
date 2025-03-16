import React, { useState, useEffect } from 'react';
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
import { Edit, Search } from 'lucide-react';
import { X } from 'lucide-react';

const itemsPerPage = 7;

const DashboardPage = () => {
    const [students, setStudents] = useState([
        { id: 1, name: 'Ali Ahmed', cms: '2020-CS-001', status: 'Paid', amountPaid: 25000 },
        { id: 2, name: 'Sara Khan', cms: '2020-EE-015', status: 'Unpaid', amountPaid: 0 },
        { id: 3, name: 'Usman Ghani', cms: '2020-SE-022', status: 'Paid', amountPaid: 30000 },
        { id: 4, name: 'Ayesha Siddiqui', cms: '2020-CS-005', status: 'Unpaid', amountPaid: 0 },
        { id: 5, name: 'Bilal Raza', cms: '2020-EE-010', status: 'Paid', amountPaid: 28000 },
        { id: 6, name: 'Fatima Ali', cms: '2020-SE-030', status: 'Paid', amountPaid: 25000 },
        { id: 7, name: 'Hamza Khan', cms: '2020-CS-012', status: 'Unpaid', amountPaid: 0 },
        { id: 8, name: 'Nimra Butt', cms: '2020-EE-003', status: 'Paid', amountPaid: 32000 },
        { id: 9, name: 'Qasim Shah', cms: '2020-SE-018', status: 'Unpaid', amountPaid: 0 },
        { id: 10, name: 'Sana Javed', cms: '2020-CS-008', status: 'Paid', amountPaid: 27000 },
        { id: 11, name: 'Tahir Mehmood', cms: '2020-EE-025', status: 'Unpaid', amountPaid: 0 },
        { id: 12, name: 'Uzma Khan', cms: '2020-SE-009', status: 'Paid', amountPaid: 31000 },
        { id: 13, name: 'Waqas Ali', cms: '2020-CS-019', status: 'Unpaid', amountPaid: 0 },
        { id: 14, name: 'Zainab Fatima', cms: '2020-EE-007', status: 'Paid', amountPaid: 29000 },
        { id: 15, name: 'Yaseen Khan', cms: '2020-SE-028', status: 'Unpaid', amountPaid: 0 },
        { id: 16, name: 'Kiran Malik', cms: '2020-CS-003', status: 'Paid', amountPaid: 26000 },
        { id: 17, name: 'Ejaz Ahmed', cms: '2020-EE-018', status: 'Unpaid', amountPaid: 0 },
        { id: 18, name: 'Sofia Hassan', cms: '2020-SE-011', status: 'Paid', amountPaid: 30500 },
        { id: 19, name: 'Rehan Ali', cms: '2020-CS-016', status: 'Unpaid', amountPaid: 0 },
        { id: 20, name: 'Amna Raza', cms: '2020-EE-005', status: 'Paid', amountPaid: 27500 },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [editedAmount, setEditedAmount] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset page on search
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        setCurrentPage(1); // Reset page on filter
    };

    const openEditModal = (student) => {
        setEditingStudent(student);
        setEditedAmount(student.amountPaid.toString());
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingStudent(null);
        setEditedAmount('');
    };

    const handleEditAmountChange = (event) => {
        setEditedAmount(event.target.value);
    };

    const saveEditedAmount = () => {
        if (editingStudent) {
            const updatedStudents = students.map(student =>
                student.id === editingStudent.id ? { ...student, amountPaid: parseFloat(editedAmount) } : student
            );
            setStudents(updatedStudents);
            closeEditModal();
        }
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
                    Personal / <span className="font-semibold text-text-DEFAULT">Dashboard</span>
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
                                    <TableHead>Amount</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.cms}</TableCell>
                                        <TableCell>{student.status}</TableCell>
                                        <TableCell>{student.status === 'Paid' ? student.amountPaid : '-'}</TableCell>
                                        <TableCell className="text-right">
                                            {student.status === 'Paid' && (
                                                <Button variant="outline" size="icon" onClick={() => openEditModal(student)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {currentStudents.length === 0 && filteredStudents.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4">No students found on this page.</TableCell>
                                    </TableRow>
                                )}
                                {filteredStudents.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4">No students match your search criteria.</TableCell>
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

                {/* Edit Amount Modal */}
                {isEditModalOpen && editingStudent && (
                    <div className="fixed px-3 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-md shadow-lg w-full max-w-md">
                            <div className="p-4 border-b border-muted-DEFAULT flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-text-DEFAULT">Edit Amount Paid</h2>
                                <Button variant="ghost" size="icon" onClick={closeEditModal} className="text-text-light hover:bg-muted-DEFAULT">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-4">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-amount" className="text-text-DEFAULT">
                                            Amount Paid
                                        </Label>
                                        <Input
                                            id="edit-amount"
                                            type="number"
                                            placeholder="Enter new amount"
                                            value={editedAmount}
                                            onChange={handleEditAmountChange}
                                        />
                                    </div>
                                    <Button onClick={saveEditedAmount} className="bg-primary-500 text-white hover:bg-primary-600">
                                        Save Changes
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

export default DashboardPage;