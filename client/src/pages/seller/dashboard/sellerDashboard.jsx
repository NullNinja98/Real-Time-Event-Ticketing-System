import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  TicketIcon, 
  Wallet, 
  UserIcon, 
  CalendarIcon
} from 'lucide-react';
import SellerNavbar from '../../../components/sellerNavbar';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [overallStats, setOverallStats] = useState({
    totalTicketsSold: 0,
    totalIncome: 0,
    totalTransactions: 0
  });
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [usersCount, setUsersCount] = useState([]);
  const [eventsCount, setEventsCount] = useState([]);


  // Fetch overall statistics
  useEffect(() => {
    const fetchOverallStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/payments/stats/overall');
        const data = await response.json();
        setOverallStats(data);
      } catch (error) {
        console.error('Error fetching overall stats:', error);
      }
    };
    fetchOverallStats();
  }, []);

// Fetch user count
useEffect(() => {
  const fetchOverallUsersCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/users/total');
      const data = await response.json();
      setUsersCount(data.totalUsers); 
    } catch (error) {
      console.error('Error fetching users total:', error);
    }
  };
  fetchOverallUsersCount();
}, []);

// Fetch event count
useEffect(() => {
  const fetchOverallEventsCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/events/total');
      const data = await response.json();
      setEventsCount(data.totalEvents); 
    } catch (error) {
      console.error('Error fetching events total:', error);
    }
  };
  fetchOverallEventsCount();
}, []);


  // Fetch monthly statistics
  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/payments/stats/monthly');
        const data = await response.json();
        
        // Transform the data for the charts
        const transformedData = data.map(stat => ({
          name: `${stat._id.year}-${stat._id.month}`,
          tickets: stat.totalTickets,
          income: stat.totalIncome,
          transactions: stat.count
        }));
        
        setMonthlyStats(transformedData);
      } catch (error) {
        console.error('Error fetching monthly stats:', error);
      }
    };
    fetchMonthlyStats();
  }, []);

  return (
    <div>
      <SellerNavbar />
      <div className="container mx-auto p-4 bg-gray-50 min-h-screen mt-20">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Seller Dashboard</h1>
        
        {/* Tabs */}
        <div className="flex mb-6">
          <button 
            className={`px-4 py-2 mr-2 rounded ${activeTab === 'overview' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-2 rounded ${activeTab === 'analytics' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Advanced Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">Total Tickets Sold</span>
                  <TicketIcon className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold">{overallStats.totalTicketsSold}</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">Total Income</span>
                  <Wallet className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold">{overallStats.totalIncome?.toLocaleString()} LKR</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500">Total Users</span>
                <UserIcon className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold">{usersCount}</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500">Total Events</span>
                <CalendarIcon className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold">{eventsCount}</div>
            </div>
              
             
            </div>
            
            {/* Monthly Sales Analysis Graph */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Monthly Sales Analysis</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" className="text-gray-200" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="tickets" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    name="Tickets Sold"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#82ca9d" 
                    name="Income (LKR)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Advanced Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Ticket Sales Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tickets" fill="#8884d8" name="Tickets Sold" />
                  <Bar dataKey="transactions" fill="#82ca9d" name="Transactions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Income Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#82ca9d" 
                    name="Income (LKR)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;