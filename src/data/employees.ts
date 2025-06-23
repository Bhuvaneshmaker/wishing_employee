export interface Employee {
  id: number;
  name: string;
  birthday: string; // MM-DD format
  joinDate: string; // YYYY-MM-DD format
  department: string;
  position: string;
}

// Mock employee data - In production, this would be imported from Excel
export const employees: Employee[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    birthday: "03-15", // March 15
    joinDate: "2021-08-12",
    department: "Human Resources",
    position: "HR Manager"
  },
  {
    id: 2,
    name: "Michael Chen",
    birthday: "07-22", // July 22
    joinDate: "2020-03-10",
    department: "Engineering",
    position: "Senior Software Engineer"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    birthday: "11-08", // November 8
    joinDate: "2022-01-15",
    department: "Marketing",
    position: "Marketing Specialist"
  },
  {
    id: 4,
    name: "David Thompson",
    birthday: "05-03", // May 3
    joinDate: "2019-11-20",
    department: "Finance",
    position: "Financial Analyst"
  },
  {
    id: 5,
    name: "Lisa Park",
    birthday: "09-17", // September 17
    joinDate: "2021-06-01",
    department: "Design",
    position: "UX Designer"
  },
  {
    id: 6,
    name: "James Wilson",
    birthday: "12-25", // December 25
    joinDate: "2020-09-08",
    department: "Sales",
    position: "Sales Manager"
  },
  {
    id: 7,
    name: "Amanda Davis",
    birthday: "02-14", // February 14
    joinDate: "2022-04-18",
    department: "Operations",
    position: "Operations Coordinator"
  },
  {
    id: 8,
    name: "Robert Kim",
    birthday: "08-30", // August 30
    joinDate: "2019-07-12",
    department: "Engineering",
    position: "DevOps Engineer"
  },
  {
    id: 9,
    name: "Jennifer Adams",
    birthday: "04-12", // April 12
    joinDate: "2021-10-25",
    department: "Customer Success",
    position: "Customer Success Manager"
  },
  {
    id: 10,
    name: "Thomas Brown",
    birthday: "06-28", // June 28
    joinDate: "2020-12-03",
    department: "Legal",
    position: "Legal Counsel"
  },
  {
    id: 11,
    name: "Maria Garcia",
    birthday: "01-09", // January 9
    joinDate: "2022-08-14",
    department: "Marketing",
    position: "Content Manager"
  },
  {
    id: 12,
    name: "Kevin Lee",
    birthday: "10-19", // October 19
    joinDate: "2021-02-28",
    department: "IT Support",
    position: "IT Specialist"
  }
];