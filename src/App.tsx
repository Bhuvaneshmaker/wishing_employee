import React, { useState, useEffect } from 'react';
import { Calendar, Gift, Users, Cake, Heart, Star } from 'lucide-react';
import * as XLSX from 'xlsx';
import './App.css';


const EmployeeBirthdayApp = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [birthdayEmployees, setBirthdayEmployees] = useState([]);
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);
  const [todayJoin , setTodayJoin] = useState([]);
  const [joinEmployee , setJoinEmployee] = useState([])

  // Sample data - replace with your Excel data
  const sampleEmployees = [
{
    id: 1,
    name: "Hemnath Chandrasekaran",
    birthday: "1994-09-02", // 2-Sep-1994
    joinDate: "2017-05-17", //8-May-17

  },
  {
    id: 2,
    name: "K ShyamalaDevi",
    birthday: "1980-12-07", // 7-Dec-1980
    joinDate: "2019-10-19", //10-Oct-19
    
  },
  {
    id: 3,
    name: "Muthamma Pandu",
    birthday: "1970-02-06", // 6-Feb-1970
    joinDate: "2022-01-15", //1-Feb-20

  },
  {
    id: 4,
    name: "Venkatesh Arumugam",
    birthday: "1999-12-17", // 17-Dec-1999
    joinDate: "2020-11-05", //5-Nov-20

  },
  {
    id: 5,
    name: "Lokesh Venkatesan",
    birthday: "1996-05-10", // 10-May-1996
    joinDate: "2020-12-01", // 1-Dec-20

  },
  ];

  useEffect(() => {
    setEmployees(sampleEmployees);
    checkTodaysBirthdays(sampleEmployees);
    checkTodayJoin(sampleEmployees)
  },[2]);

  useEffect(() => {
    filterBirthdaysByDate(selectedDate);
    filterJoinEmployee(selectedDate)
  }, [selectedDate, employees]);


// to Fetch the data and Details are stored in Excel 

const fetchExcelFile = async () => {
    try {
      const response = await fetch('src/data/employee_detail.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      const formattedData = jsonData.map(row => {
        const joinDateRaw = row['Join Date'] || row.joinDate || row['Joining Date'] || '';
        const joinDateParsed = parseExcelDate(joinDateRaw);

        return {
          id: row.id || row.ID || row['Employee ID'] || '',
          name: row.name || row.Name || '',
          birthday: parseExcelDate(row.birthday || row.Birthday || row.DOB || ''),
          joinDate: joinDateParsed,
          isAnniversary: isTodayAnniversary(joinDateParsed),
          yearsOfService: getYearsOfService(joinDateParsed)
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

// to check and calculate the Age counting
  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

   // to check the birthday is present or not in this section

const checkTodaysBirthdays = (employeeList) => {
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  const birthdays = employeeList.filter(emp => {
    const empBirthday = new Date(emp.birthday);
    return empBirthday.getMonth() === todayMonth && empBirthday.getDate() === todayDate;
  });

  setTodaysBirthdays(birthdays);
};

  // to filter the data the birthday for using month and date

const filterBirthdaysByDate = (date) => {
  const selectedMonth = date.getMonth();
  const selectedDate = date.getDate();

  const birthdays = employees.filter(emp => {
    const empBirthday = new Date(emp.birthday);
    return empBirthday.getMonth() === selectedMonth && empBirthday.getDate() === selectedDate;
  });

  setBirthdayEmployees(birthdays); 
};


  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // the joined date of the person
const isJoinDate = (day) => {
  const joinDateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day); 
    return employees.some(emp => {
    const empJoined = new Date(emp.joinDate);
  return empJoined.getDate() === day &&
        empJoined.getMonth() === joinDateObj.getMonth() &&
        empJoined.getFullYear() === joinDateObj.getFullYear() })
      }
  
const checkTodayJoin = (employeeList) => {
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  const employees = employeeList.filter(emp => {
    const empJoined = new Date(emp.joinDate);
    return empJoined.getMonth() === todayMonth && empJoined.getDate() === todayDate;
  });

  setTodayJoin(employees);
};

const filterJoinEmployee = (date) => {
  const selectedMonth = date.getMonth();
  const selectedDay = date.getDate();

  const joinedOnSelectedDate = employees.filter(emp => {
    const empJoinDate = new Date(emp.joinDate);
    return empJoinDate.getMonth() === selectedMonth && empJoinDate.getDate() === selectedDay;
  });

  setJoinEmployee(joinedOnSelectedDate);
};




  // to check if the date has any birthday
const hasBirthdayOnDate = (day) => {
  const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
  return employees.some(emp => {
    const empBirthday = new Date(emp.birthday);
    return empBirthday.getMonth() === checkDate.getMonth() && 
           empBirthday.getDate() === checkDate.getDate();
  });
};

  // if two or mare person has same date



  // the calender and the date show for birthady and joined day
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Empty cells for days before the first day of the month

      for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentMonth.getMonth() &&
                        selectedDate.getFullYear() === currentMonth.getFullYear();
      const hasBirthday = hasBirthdayOnDate(day);
      const isJoin = isJoinDate(day);
     days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${hasBirthday ? 'has-birthday' : ''}`}
          onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
        >
          {day}
          {hasBirthday && <div className="birthday-indicator" style={{ fontSize: '30px' }}>🎂</div>}
          {isJoin && <div className="join-indicator" style={{ fontSize: '20px' }}>⭐</div>}
        </div>
      );
    }
     
    return days;
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

const isTodayAnniversary = (dateStr) => {
  if (!dateStr) return false;
  const today = new Date();
  const date = new Date(dateStr);
  return (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth()
  );
};

 // the number of years they worked

const getYearsOfService = (joinDate) => {
  const today = new Date();
  const joined = new Date(joinDate);
  let years = today.getFullYear() - joined.getFullYear();

  const hasNotHadAnniversaryThisYear =
    today.getMonth() < joined.getMonth() ||
    (today.getMonth() === joined.getMonth() && today.getDate() < joined.getDate());

  if (hasNotHadAnniversaryThisYear) {
    years--;
  }

  return years;
};




  return (
 
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="container mx-auto px-4 py-8 tect-center">
       
      {/* Header */}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2 flex items-center justify-center gap-3">
            <Gift className="text-pink-600" />
            Employee Birthday Planning
            <Cake className="text-pink-600" />
          </h1>
          <p className="text-gray-600">We always remember your birthday celebration!</p>
        </div>

        {/* File Upload */}
{/* 
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="text-blue-600" />
            Upload Employee Data
          </h3>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={fetchExcelFile}
            className="form-control mb-3"
          />
          <small className="text-gray-500">
            Upload an Excel file with columns: Name, Birthday, Join Date
          </small>
        </div>
*/}
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
                      <p className="text-sm">🎊 "Wishing you a fantastic birthday filled with joy, laughter, and wonderful memories!"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

          {/* Joined today */}

          {todayJoin.length > 0 && (
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Star className="text-yellow-300" />
              🎉 The Person Step to next successful year! 🎉
            </h2>
            <div className="row">
              {todayJoin.map((emp, index) => (
                <div key={index} className="col-md-6 mb-3">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <h4 className="font-bold text-xl">{emp.name}</h4>
                    <p className="text-pink-100">🎉 Stepping {getYearsOfService(emp.joinDate)} years!</p>
                    <div className="mt-2 p-2 bg-white bg-opacity-10 rounded">
                      <p className="text-sm">🎊 "The Successful story of {emp.name} in our company with {emp.joinDate}!"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="row">
          
        {/* Calendar */}

          <div className="col-lg-8 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => changeMonth(-1)}
                >
                  ← Previous
                </button>
                <h3 className="text-xl-black font-semibold text-center">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => changeMonth(1)}
                >
                  Next →
                </button>
              </div>
              
              <div className="calendar-grid">
                <div className="calendar-header">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="calendar-day-header">{day}</div>
                  ))}
                </div>
                <div className="calendar-body text-black">
                  {renderCalendar()}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Date Details */}
        <div className='birth'>
          <div className="col-lg-4">
            <div className="bg-back rounded-lg shadow-md p-6 mb-4">
              <h3 className="text-xl-white  font-semibold mb-3 flex items-center gap-2">
                <Calendar className="text-blue-600" />
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric' 
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
                      <p className="text-sm text-gray-600 mb-2">
                        🎂 Age: {calculateAge(emp.birthday)} years
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        📅 Joined: {formatDate(emp.joinDate)} ({getYearsOfService(emp.joinDate)} years of service)
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
            <div className='contain'>
                <div className="col-lg-4">
                  <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="text-blue-600" />
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </h3>

                    {joinEmployee.length > 0 ? (
                      <div>
                        <h4 className="text-lg font-semibold text-green-600 mb-3">
                          🎉 Work Anniversary ({joinEmployee.length})
                        </h4>
                        {joinEmployee.map((emp, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-3"
                          >
                            <h5 className="font-bold text-lg text-blue-800">{emp.name}</h5>
                            <p className="text-sm text-gray-600 mb-2">
                              📅 Joined: {formatDate(emp.joinDate)} ({getYearsOfService(emp.joinDate)} years of service)
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
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
                  {/* Statistics */}
                  <div className='stats'>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-lg font-semibold mb-3">📊 Quick Stats</h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        Total Employees: <span className="font-bold text-blue-600">{employees.length}</span>
                      </p>
                      <p className="text-sm">
                        Today's Birthdays: <span className="font-bold text-pink-600">{todaysBirthdays.length}</span>
                      </p>
                                            <p className="text-sm">
                        Today's Join Employees: <span className="font-bold text-pink-600">{joinEmployee.length}</span>
                      </p>
                      <p className="text-sm">
                        This Month's Birthday:{" "}
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
    </div>
  );
};

export default EmployeeBirthdayApp;
