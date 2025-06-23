import React from 'react';
import { Cake, Users, Calendar } from 'lucide-react';

interface HeaderProps {
  totalEmployees: number;
  birthdaysThisMonth: number;
}

const Header: React.FC<HeaderProps> = ({ totalEmployees, birthdaysThisMonth }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Cake className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Employee Birthday Tracker
            </h1>
          </div>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Never miss a birthday! With celebrations, ages, and company milestones in one beautiful interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-blue-200" />
              <span className="text-blue-100 font-medium">Total Employees</span>
            </div>
            <p className="text-3xl font-bold">{totalEmployees}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Cake className="w-6 h-6 text-orange-200" />
              <span className="text-blue-100 font-medium">Birthdays This Month</span>
            </div>
            <p className="text-3xl font-bold">{birthdaysThisMonth}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-green-200" />
              <span className="text-blue-100 font-medium">Current Month</span>
            </div>
            <p className="text-3xl font-bold">
              {new Date().toLocaleDateString('en-US', { month: 'short' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
