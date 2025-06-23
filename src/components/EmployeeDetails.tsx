import React from 'react';
import { User, Calendar, Briefcase, Gift, PartyPopper } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  birthday: string; // MM-DD-YYYY format
  joinDate: string; // YYYY-MM-DD format
}

interface EmployeeDetailsProps {
  employees: Employee[];
  selectedDate: Date | null;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employees, selectedDate }) => {
  if (!selectedDate) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-medium mb-2">Select a Date</h3>
          <p>Click on any date in the calendar to see birthday celebrations and employee details.</p>
        </div>
      </div>
    );
  }

  const selectedMonthDay = `${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const birthdayEmployees = employees.filter(emp => emp.birthday === selectedMonthDay);

const calculateAge = (birthDate: string, birthYear: number) => {
  const [month, day] = birthDate.split('-').map(Number);
  const today = new Date();
  const currentYear = today.getFullYear();
  const hasBirthdayOccurred = (
    today.getMonth() > month - 1 || 
    (today.getMonth() === month - 1 && today.getDate() >= day)
  );

  const age = hasBirthdayOccurred 
    ? currentYear - birthYear 
    : currentYear - birthYear - 1;
  return age;
};

  const calculateTenure = (joinDate: string) => {
    const joinDateTime = new Date(joinDate);
    const now = new Date();
    const years = now.getFullYear() - joinDateTime.getFullYear();
    const months = now.getMonth() - joinDateTime.getMonth();
    
    let totalMonths = years * 12 + months;
    if (now.getDate() < joinDateTime.getDate()) {
      totalMonths--;
    }
    
    const tenureYears = Math.floor(totalMonths / 12);
    const tenureMonths = totalMonths % 12;
    
    if (tenureYears > 0) {
      return `${tenureYears} year${tenureYears > 1 ? 's' : ''} ${tenureMonths > 0 ? `and ${tenureMonths} month${tenureMonths > 1 ? 's' : ''}` : ''}`;
    }
    return `${tenureMonths} month${tenureMonths > 1 ? 's' : ''}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBirthdayMessage = (name: string, age: number) => {
    const messages = [
      `🎉 Happy Birthday, ${name}! Wishing you a fantastic ${age}th year ahead!`,
      `🎂 Another year of amazing accomplishments! Happy ${age}th Birthday, ${name}!`,
      `🌟 Celebrating ${age} years of your wonderful presence! Happy Birthday, ${name}!`,
      `🎈 Here's to ${age} years of greatness and many more to come! Happy Birthday, ${name}!`,
      `🎊 ${name}, may your ${age}th year be filled with joy, success, and happiness!`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {formatDate(selectedDate)}
          </h2>
        </div>
      </div>

      <div className="p-6">
        {birthdayEmployees.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Gift className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No birthdays on this date</p>
            <p className="text-sm">Select a date with a birthday indicator to see celebrations!</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <PartyPopper className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-bold text-gray-800">
                Birthday Celebration{birthdayEmployees.length > 1 ? 's' : ''}!
              </h3>
            </div>

            {birthdayEmployees.map((employee) => {
              const age = calculateAge(employee.birthday);
              const tenure = calculateTenure(employee.joinDate);
              
              return (
                <div key={employee.id} className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg p-6 border border-orange-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-full p-3">
                      <User  className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{employee.name}</h4>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4 border border-orange-100">
                    <p className="text-lg font-medium text-gray-800 leading-relaxed">
                      {getBirthdayMessage(employee.name, age)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-700">Loving Age :</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{age} years old</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-700">Company Tenure :</span>
                      </div>
                      <p className="text-lg font-medium text-blue-600">{tenure}</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 md:col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-700">Joined :</span>
                      </div>
                      <p className="text-lg font-medium text-green-600">
                        {new Date(employee.joinDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;
