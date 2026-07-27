import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


type EmployeeRole =
    | "admin"
    | "hr"
    | "manager"
    | "employee";

type EmploymentType =
    | "full-time"
    | "part-time"
    | "contract"
    | "intern";

interface EmployeeForm {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    job_title: string;
    role: EmployeeRole;
    employment_type: EmploymentType;
    hire_date: string;
}
const initialForm: EmployeeForm = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    job_title: "",
    role: "employee",
    employment_type: "full-time",
    hire_date: "",
};


const AddEmployeeModal = () => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<EmployeeForm>(initialForm);
    const [hireDate, setHireDate] = useState<Date | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);
        // POST API HERE
        setForm(initialForm);
        setOpen(false);
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-9 gap-2 rounded-md px-3 text-sm text-white">
                    <UserPlus className="h-4 w-4" />
                    Add Employee
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-xl bg-white max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-base">
                        Add Employee
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>
                                First Name
                            </Label>
                            <Input
                                name="first_name"
                                value={form.first_name}
                                onChange={handleChange}
                                className="h-10 rounded-lg border border-gray-200 bg-white px-3 shadow-sm focus:border-primary focus:ring-1 focus:ring-secondary/20"
                                placeholder="Enter first name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>
                                Last Name
                            </Label>
                            <Input
                                name="last_name"
                                value={form.last_name}
                                onChange={handleChange}
                                className="h-10 rounded-lg border border-gray-200 bg-white px-3 shadow-sm focus:border-primary focus:ring-1 focus:ring-secondary/20"
                                placeholder="Enter Last name"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>
                                Email
                            </Label>
                            <Input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                className="h-10 rounded-lg border border-gray-200 bg-white px-3 shadow-sm focus:border-primary focus:ring-1 focus:ring-secondary/20"
                                placeholder="e.g. john.doe@vaad.com"
                            />

                        </div>
                        <div className="space-y-2">
                            <Label>
                                Phone
                            </Label>
                            <Input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="h-10 rounded-lg border border-gray-200 bg-white px-3 shadow-sm focus:border-primary focus:ring-1 focus:ring-secondary/20"
                                placeholder="e.g. +234 801 234 5678"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date of Hire</Label>

                            <div className="w-full">
                                <DatePicker
                                    selected={hireDate}
                                    onChange={(date: Date | null) => {
                                        setHireDate(date);

                                        setForm((prev) => ({
                                            ...prev,
                                            hire_date: date ? format(date, "yyyy-MM-dd") : "",
                                        }));
                                    }}
                                    dateFormat="dd MMM yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    placeholderText="Select hire date"
                                    wrapperClassName="w-full"
                                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 shadow-sm focus:border-primary focus:ring-1 focus:ring-secondary/20"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>
                                Job Title
                            </Label>
                            <Input
                                name="job_title"
                                value={form.job_title}
                                onChange={handleChange}
                                className="h-10 rounded-lg border border-gray-200 bg-white px-3 shadow-sm focus:border-primary focus:ring-1 focus:ring-secondary/20"
                                placeholder="e.g. Software Engineer"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="h-9 gap-2 rounded-md px-3 text-sm text-black"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="h-9 gap-2 rounded-md px-3 text-sm text-white cursor-pointer">
                            Add Employee
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

    );

};


export default AddEmployeeModal;