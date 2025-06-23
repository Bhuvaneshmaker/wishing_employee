import React, { useState, useMemo } from 'react';
import Calendar from './components/Calendar';
import EmployeeDetails from './components/EmployeeDetails';
import Header from './components/Header';
import { employees } from './data/employees';

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const birthdaysThisMonth = useMemo(() => {
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    return employees.filter(emp => emp.birthday.startsWith(currentMonth)).length;
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        totalEmployees={employees.length} 
        birthdaysThisMonth={birthdaysThisMonth}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="order-2 xl:order-1">
            <Calendar 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              employees={employees}
            />
          </div>
          
          <div className="order-1 xl:order-2">
            <EmployeeDetails 
              employees={employees}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            Employee Birthday Tracker - Making workplace celebrations memorable
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Click on calendar dates to view birthday celebrations and employee details
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;