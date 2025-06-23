import React from 'react';
import { ChevronLeft, ChevronRight, Cake } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  birthday: string; // MM-DD format
  joinDate: string; // YYYY-MM-DD format
  department: string;
  position: string;
}

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  employees: Employee[];
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, employees }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const hasBirthday = (date: Date) => {
    const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return employees.some(emp => emp.birthday === monthDay);
  };

  const getBirthdayEmployees = (date: Date) => {
    const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return employees.filter(emp => emp.birthday === monthDay);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 md:h-16"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      const hasBday = hasBirthday(date);
      const birthdayEmployees = getBirthdayEmployees(date);

      days.push(
        <div
          key={day}
          onClick={() => onDateSelect(date)}
          className={`
            relative h-12 md:h-16 flex items-center justify-center cursor-pointer rounded-lg border border-transparent
            transition-all duration-200 hover:bg-blue-50 hover:border-blue-200
            ${isSelected ? 'bg-blue-100 border-blue-300 shadow-md' : ''}
            ${hasBday ? 'bg-gradient-to-br from-orange-100 to-pink-100 border-orange-200' : ''}
          `}
        >
          <span className={`text-sm md:text-base font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
            {day}
          </span>
          {hasBday && (
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full p-1">
              <Cake className="w-3 h-3 text-white" />
            </div>
          )}
          {hasBday && birthdayEmployees.length > 1 && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {birthdayEmployees.length}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map(day => (
          <div key={day} className="h-8 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-500">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-orange-100 to-pink-100 border border-orange-200 rounded"></div>
            <span className="text-gray-600">Birthday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-gray-600">Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;