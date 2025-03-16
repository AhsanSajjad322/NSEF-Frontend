import React, { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ComplaintPage = () => {
    const [submissionType, setSubmissionType] = useState('');
    const [details, setDetails] = useState('');
    const [attachment, setAttachment] = useState(null);

    const handleAttachmentChange = (event) => {
        setAttachment(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('type', submissionType);
        formData.append('details', details);
        if (attachment) {
            formData.append('attachment', attachment);
        }

        console.log('Complaint/Feedback Data:', {
            type: submissionType,
            details: details,
            attachment: attachment ? attachment.name : null,
        });

        // In a real application, you would send this formData to your server
        // You might also want to show a success message and reset the form
        setSubmissionType('');
        setDetails('');
        setAttachment(null);
    };

    return (
        <div className="bg-background-DEFAULT min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Breadcrumb */}
                <div className="text-sm text-text-light mb-4">
                    Personal / <span className="font-semibold text-text-DEFAULT">Complaint</span>
                </div>

                {/* Complaint/Feedback Form */}
                <Card className="shadow-sm border border-muted-DEFAULT">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold mb-4 text-text-DEFAULT">Complaint / Feedback</h2>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="type" className="text-text-DEFAULT">
                                    Type of Submission
                                </Label>
                                <Select value={submissionType} onValueChange={setSubmissionType} required>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Complaint">Complaint</SelectItem>
                                        <SelectItem value="Feedback">Feedback</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="details" className="text-text-DEFAULT">
                                    Details
                                </Label>
                                <Textarea
                                    id="details"
                                    placeholder="Enter your complaint or feedback details here"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    rows={6}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="attachment" className="text-text-DEFAULT">
                                    Attachment (Optional)
                                </Label>
                                <Input
                                    id="attachment"
                                    type="file"
                                    accept="image/*, application/pdf" // Example accepted file types
                                    onChange={handleAttachmentChange}
                                />
                                {attachment && (
                                    <p className="text-sm text-text-light mt-1">
                                        Selected file: {attachment.name}
                                    </p>
                                )}
                            </div>
                            <Button type="submit" className="bg-primary-500 text-white hover:bg-primary-600">
                                Submit
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ComplaintPage;