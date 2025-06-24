import React, { useState, useEffect } from 'react';
import { Calendar, Gift, Users, Cake, Heart, Star } from 'lucide-react';
import * as XLSX from 'xlsx';
import './App.css';
import sampleEmployees from './data/employee_detail.js';

const EmployeeBirthdayApp = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [birthdayEmployees, setBirthdayEmployees] = useState([]);
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);
  const [todayJoin, setTodayJoin] = useState([]);
  const [joinEmployee, setJoinEmployee] = useState([]);

  useEffect(() => {
    setEmployees(sampleEmployees);
    checkTodaysBirthdays(sampleEmployees);
    checkTodayJoin(sampleEmployees);
  }, []);

  useEffect(() => {
    filterBirthdaysByDate(selectedDate);
    filterJoinEmployee(selectedDate);
  }, [selectedDate, employees]);

  // to use fetch data from the excel or data.js
  const fetchExcelFile = async () => {
    try {
      const response = await fetch('src/data/employee_detail.js');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      const formattedData = jsonData.map(row => {
        const joinDate = parseExcelDate(row['Join Date'] || row.joinDate || '');
        const birthday = parseExcelDate(row['Birthday'] || row.birthday || row.DOB || '');
        return {
          id: row.ID || row.id || '',
          name: row.Name || row.name || '',
          birthday,
          joinDate,
          isAnniversary: isTodayAnniversary(joinDate),
          yearsOfService: getYearsOfService(joinDate)
        };
      });

      setEmployees(formattedData);
      checkTodaysBirthdays(formattedData);
      checkTodayJoin(formattedData);
    } catch (error) {
      console.error('Error reading Excel file:', error);
    }
  };

  useEffect(() => {
    fetchExcelFile();
  }, []);

  const parseExcelDate = (excelDate) => {
    if (!excelDate) return '';
    if (typeof excelDate === 'string') return excelDate;
    const date = XLSX.SSF.parse_date_code(excelDate);
    if (!date) return '';
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  };

    // to calculate the age of the person and the birthday

  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // the employee with number of years works here

  const getYearsOfService = (joinDate) => {
    const today = new Date();
    const joined = new Date(joinDate);
    let years = today.getFullYear() - joined.getFullYear();
    if (
      today.getMonth() < joined.getMonth() ||
      (today.getMonth() === joined.getMonth() && today.getDate() < joined.getDate())
    ) {
      years--;
    }
    return years;
  };

  // to check and confirm if the birthday is or not
  const checkTodaysBirthdays = (list) => {
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();
    const birthdays = list.filter(emp => {
      const empBirthday = new Date(emp.birthday);
      return empBirthday.getMonth() === todayMonth && empBirthday.getDate() === todayDate;
    });
    setTodaysBirthdays(birthdays);
  };

  // to check the join date here

  const checkTodayJoin = (list) => {
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();
    const joins = list.filter(emp => {
      const empJoin = new Date(emp.joinDate);
      return empJoin.getMonth() === todayMonth && empJoin.getDate() === todayDate;
    });
    setTodayJoin(joins);
  };

  // filter from the excel and render calender for birthday
  const filterBirthdaysByDate = (date) => {
    const month = date.getMonth();
    const day = date.getDate();
    const birthdays = employees.filter(emp => {
      const empBirthday = new Date(emp.birthday);
      return empBirthday.getMonth() === month && empBirthday.getDate() === day;
    });
    setBirthdayEmployees(birthdays);
  };

  // filter from the excel and render calender for Join date
  const filterJoinEmployee = (date) => {
    const month = date.getMonth();
    const day = date.getDate();
    const joins = employees.filter(emp => {
      const empJoinDate = new Date(emp.joinDate);
      return empJoinDate.getMonth() === month && empJoinDate.getDate() === day;
    });
    setJoinEmployee(joins);
  };

  // to make the date is joined
  const isTodayAnniversary = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    const date = new Date(dateStr);
    return today.getDate() === date.getDate() && today.getMonth() === date.getMonth();
  };

  // the person has celebrate birthday
  const hasBirthdayOnDate = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return employees.some(emp => {
      const bday = new Date(emp.birthday);
      return bday.getDate() === date.getDate() && bday.getMonth() === date.getMonth();
    });
  };

  // the join confirm to show the date on calender
  const isJoinDate = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return employees.some(emp => {
      const jDate = new Date(emp.joinDate);
      return jDate.getDate() === date.getDate() && jDate.getMonth() === date.getMonth() ;
    });
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const renderCalendar = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();

      const hasBday = hasBirthdayOnDate(day);
      const hasJoin = isJoinDate(day);

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${hasBday ? 'has-birthday' : ''}`}
          onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
        >
          {day}
          {hasBday && <div className="birthday-indicator" style={{fontSize:'30px'}}>🎂</div>}
          {hasJoin && <div className="join-indicator" style={{fontSize:'30px'}}>⭐</div>}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });


return (
  <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
    <div className="container mx-auto px-4 py-8 text-center">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-purple-800 mb-2 flex items-center justify-center gap-3">
          <Gift className="text-pink-600" />
          Employee Birthday Planning
          <Cake className="text-pink-600" />
        </h1>
        <p className="text-gray-600">We always remember your birthday celebration!</p>
      </div>

      {/* Today's Birthdays */}
      {todaysBirthdays.length > 0 && (
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Star className="text-yellow-300" />
            🎉 Today Birthday Celebrating Person! 🎉
          </h2>
          <div className="row">
            {todaysBirthdays.map((emp, index) => (
              <div key={index} className="col-md-6 mb-3">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h4 className="font-bold text-xl">{emp.name}</h4>
                  <p className="text-pink-100">🎂 Turning {calculateAge(emp.birthday)} years old!</p>
                  <div className="mt-2 p-2 bg-white bg-opacity-10 rounded">
                    <p className="text-sm">
                      🎊 "Wishing you a fantastic birthday filled with joy, laughter, and wonderful memories!"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Work Anniversaries */}
      {todayJoin.length > 0 && (
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Star className="text-yellow-300" />
            🎉 The Person Steps Into Another Successful Year! 🎉
          </h2>
          <div className="row">
            {todayJoin.map((emp, index) => (
              <div key={index} className="col-md-6 mb-3">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h4 className="font-bold text-xl">{emp.name}</h4>
                  <p className="text-pink-100">🎉 Stepping into {getYearsOfService(emp.joinDate)} years!</p>
                  <div className="mt-2 p-2 bg-white bg-opacity-10 rounded">
                    <p className="text-sm">
                      🎊 "The successful story of {emp.name} in our company since {formatDate(emp.joinDate)}!"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar and that thing of alginment */}
      <div className="row">
        {/* Calendar */}
        <div className="col-lg-8 mb-6">
          <div className="bg-black rounded-lg shadow-md p-6">
            <div className="d-flex justify-between items-center mb-4">
              <button className="btn btn-outline-primary" onClick={() => changeMonth(-1)}>
                ← Previous
              </button>
              <h3 className="text-black-xl font-semibold text-center">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button className="btn btn-outline-primary" onClick={() => changeMonth(1)}>
                Next →
              </button>
            </div>

            <div className="calendar-grid">
              <div className="calendar-header grid grid-cols-7 text-sm font-semibold mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="calendar-day-header">{day}</div>
                ))}
              </div>
              <div className="calendar-body">{renderCalendar()}</div>
            </div>
          </div>
        </div>

        {/* Selected Date: Birthdays */}
        <div className='birth'>
        <div className="col-lg-4 mb-4">
          <div className="bg-black rounded-lg shadow-md p-6">
            <h3 className="text-white-xl font-semibold mb-3 flex items-center gap-2">
              <Calendar className="text-blue-600" />
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}
            </h3>

            {birthdayEmployees.length > 0 ? (
              <div>
                <h4 className="text-lg font-semibold text-pink-600 mb-3">
                  🎉 Birthday Celebrants ({birthdayEmployees.length})
                </h4>
                {birthdayEmployees.map((emp, index) => (
                  <div key={index} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-3">
                    <h5 className="font-bold text-lg text-purple-800">{emp.name}</h5>
                    <p className="text-sm text-gray-600">🎂 Age: {calculateAge(emp.birthday)} years</p>
                    <p className="text-sm text-gray-600">
                      ⭐ Joined: {formatDate(emp.joinDate)} ({getYearsOfService(emp.joinDate)} years)
                    </p>
                    <div className="mt-3 p-3 bg-white rounded border-l-4 border-pink-500">
                      <p className="text-sm text-pink-700 font-medium">
                        <Heart className="inline w-4 h-4 mr-1" />
                        "Happy Birthday! May your special day be filled with happiness and joy!"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-3">📅</div>
                <p className="text-gray-500">No birthdays on this date</p>
              </div>
            )}
          </div>
        </div>
      </div>
        {/* Selected Date: Work Anniversaries */}
        <div className='contain'>
        <div className="col-lg-4 mb-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Calendar className="text-blue-600" />
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}
            </h3>

            {joinEmployee.length > 0 ? (
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-3">
                  🎉 Work Anniversary ({joinEmployee.length})
                </h4>
                {joinEmployee.map((emp, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-3">
                    <h5 className="font-bold text-lg text-blue-800">{emp.name}</h5>
                    <p className="text-sm text-gray-600">
                      ⭐ Joined: {formatDate(emp.joinDate)} ({getYearsOfService(emp.joinDate)} years)
                    </p>
                    <p className="text-sm text-gray-600">
                      🎂 Age: {calculateAge(emp.birthday)} years
                    </p>
                    <div className="mt-3 p-3 bg-white rounded border-l-4 border-green-500">
                      <p className="text-sm text-green-700 font-medium">
                        <Heart className="inline w-4 h-4 mr-1" />
                        "Happy Work Anniversary! Thank you for being an essential part of our journey!"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-3">📅</div>
                <p className="text-gray-500">No anniversaries on this date</p>
              </div>
            )}
          </div>
        </div>
      </div>
        {/* Stats details  */}
        <div className='stats'>
        <div className="col-lg-4 mb-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold mb-3">📊 Quick Stats</h4>
            <div className="space-y-2">
              <p className="text-sm">
                Total Employees: <span className="font-bold text-blue-600">{employees.length}</span>
              </p>
              <p className="text-sm">
                This Month's Birthdays:{" "}
                <span className="font-bold text-purple-600">
                  {employees.filter(emp => new Date(emp.birthday).getMonth() === currentMonth.getMonth()).length}
                </span>
              </p>
              <p className="text-sm">
                This Month's Joinings:{" "}
                <span className="font-bold text-purple-600">
                  {employees.filter(emp => new Date(emp.joinDate).getMonth() === currentMonth.getMonth()).length}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
};

export default EmployeeBirthdayApp;
