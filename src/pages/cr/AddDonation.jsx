// AddDonationPage.jsx
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
import { Search, X } from 'lucide-react';

const itemsPerPage = 7;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AddDonationPage = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
    const [donatingStudent, setDonatingStudent] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [donatingLoading, setDonatingLoading] = useState(false);

    const getToken = () => {
        return localStorage.getItem('access_token');
    };

    const getStudents = async () => {
        try {
            setLoading(true);
            setError('');
            
            const token = getToken();
            if (!token) {
                setError('Authentication token not found.');
                setLoading(false);
                return;
            }

            const fetchStudentsResponse = await fetch(`${BACKEND_URL}/fund_tracking/students/my`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!fetchStudentsResponse.ok) {
                throw new Error(`Failed to fetch students: ${fetchStudentsResponse.status}`);
            }

            const fetchedStudents = await fetchStudentsResponse.json();
            
            // Map the backend data to your frontend format
            const mappedStudents = fetchedStudents.map(student => ({
                id: student.id,
                name: `${student.user.first_name || ''} ${student.user.last_name || ''}`.trim(),
                cms: student.cms ,
            }));

            setStudents(mappedStudents);
            
        } catch (error) {
            console.error('Error fetching students:', error);
            setError('Failed to load students. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudents();
    }, []);

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

    const handleDonate = async () => {
        if (!donatingStudent || !donationAmount) {
            alert('Please enter a valid donation amount.');
            return;
        }

        try {
            setDonatingLoading(true);
            const token = getToken();
            
            if (!token) {
                alert('Authentication token not found.');
                return;
            }

            // Create donation transaction
            const donationResponse = await fetch(`${BACKEND_URL}/fund_tracking/transactions/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseFloat(donationAmount),
                    sender_id: donatingStudent.id,
                    mode: 'cash'
                })
            });

            if (!donationResponse.ok) {
                throw new Error('Failed to create donation transaction');
            }

            const transactionData = await donationResponse.json();
            console.log('Donation successful:', transactionData);

            // Update local state to reflect the donation
            const amountToAdd = parseFloat(donationAmount) || 0;
            const updatedStudents = students.map(student =>
                student.id === donatingStudent.id 
                    ? { 
                        ...student, 
                        amountPaid: student.amountPaid + amountToAdd, 
                        status: student.amountPaid + amountToAdd > 0 ? 'Paid' : 'Unpaid' 
                    } 
                    : student
            );
            setStudents(updatedStudents);
            
            alert('Donation added successfully!');
            closeDonateModal();

        } catch (error) {
            console.error('Error creating donation:', error);
            alert('Failed to add donation. Please try again.');
        } finally {
            setDonatingLoading(false);
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
            student.cms.toString().includes(searchLower)
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

    // Loading state
    if (loading) {
        return (
            <div className="bg-background-DEFAULT min-h-screen">
                <Navbar />
                <div className="container mx-auto p-4">
                    <div className="text-sm text-text-light mb-4">
                        CR / <span className="font-semibold text-text-DEFAULT">Add Donation</span>
                    </div>
                    <div className="flex justify-center items-center py-8">
                        <div className="text-lg">Loading students...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-background-DEFAULT min-h-screen">
                <Navbar />
                <div className="container mx-auto p-4">
                    <div className="text-sm text-text-light mb-4">
                        CR / <span className="font-semibold text-text-DEFAULT">Add Donation</span>
                    </div>
                    <div className="flex flex-col justify-center items-center py-8">
                        <div className="text-red-600 mb-4">{error}</div>
                        <Button 
                            onClick={getStudents}
                            className="bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

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

                    {/* Filter by status as paid or unpaid, if used in future */}
                    {/* <div className="flex items-center space-x-2">
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
                    </div> */}
                </div>

                {/* Student List */}
                <Card className="shadow-sm border border-muted-DEFAULT">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-text-DEFAULT">
                                Student Details ({students.length} students)
                            </h2>
                            <Button 
                                onClick={getStudents}
                                variant="outline"
                                className="text-sm"
                            >
                                Refresh
                            </Button>
                        </div>
                        
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>CMS</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.cms}</TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => openDonateModal(student)}
                                                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                                            >
                                                Donate
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {currentStudents.length === 0 && filteredStudents.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4">
                                            No students found on this page.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {filteredStudents.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4">
                                            {searchTerm ? 'No students match your search criteria.' : 'No students found.'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {filteredStudents.length > itemsPerPage && (
                            <div className="flex justify-between items-center mt-4">
                                <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                                    Previous
                                </Button>
                                <span className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages} ({filteredStudents.length} students)
                                </span>
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
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={closeDonateModal} 
                                    className="text-text-light hover:bg-muted-DEFAULT"
                                    disabled={donatingLoading}
                                >
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
                                            placeholder="Enter amount in PKR"
                                            value={donationAmount}
                                            onChange={handleDonationAmountChange}
                                            disabled={donatingLoading}
                                            min="1"
                                        />
                                    </div>
                                    <Button 
                                        onClick={handleDonate} 
                                        disabled={donatingLoading || !donationAmount}
                                        className="bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50"
                                    >
                                        {donatingLoading ? 'Processing...' : 'Donate'}
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