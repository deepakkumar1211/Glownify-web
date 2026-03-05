import React, { useEffect } from 'react';
import { 
  Users, Store, CreditCard, Plus, 
  TrendingUp, AlertCircle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../../redux/slice/superadminSlice';

// Mock Data for Charts
const barData = [
  { name: 'Jan', value: 45 }, { name: 'Feb', value: 52 },
  { name: 'Mar', value: 65 }, { name: 'Apr', value: 58 },
  { name: 'May', value: 78 }, { name: 'Jun', value: 92 },
];

const pieData = [
  { name: 'Rajesh Kumar', value: 27, color: '#8b5cf6' },
  { name: 'Priya Sharma', value: 23, color: '#ec4899' },
  { name: 'Amit Patel', value: 19, color: '#3b82f6' },
  { name: 'Sneha Reddy', value: 17, color: '#10b981' },
  { name: 'Others', value: 15, color: '#f59e0b' },
];

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, loading, error } = useSelector((state) => state.superadmin);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) return <div className="flex h-screen items-center justify-center font-bold">Loading Analytics...</div>;
  if (error) return <div className="text-red-500 p-8">Error loading dashboard: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-700">
      
      {/* 1. Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Sales Persons" value={dashboardData?.summary?.totalSalesman || 0} trend="+12%" icon={<Users size={24}/>} color="bg-purple-600" />
        <StatCard title="Total Salons Registered" value={dashboardData?.summary?.totalSalons || 0} trend="+23%" icon={<Store size={24}/>} color="bg-pink-500" />
        <StatCard title="Total Subscriptions Sold" value={dashboardData?.summary?.totalSubscriptionsSold || 0} trend="+18%" icon={<CreditCard size={24}/>} color="bg-blue-500" />
        <StatCard title="Independent Pros" value={dashboardData?.summary?.totalIndependentProfessionals || 0} trend="+31%" icon={<Users size={24}/>} color="bg-green-500" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Sales Executive Management</h2>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm">
                <Plus size={18} /> Register Executive
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Referral ID</th>
                    <th className="px-6 py-4 font-semibold">Sales Person</th>
                    <th className="px-6 py-4 font-semibold text-center">Managed</th>
                    <th className="px-6 py-4 font-semibold">Commission</th>
                    <th className="px-6 py-4 font-semibold">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dashboardData?.salesExecutiveManagement?.map((exec, index) => (
                    <TableRow 
                      key={index}
                      id={exec.referralId}
                      name={exec.name}
                      salons={exec.salesmanUnderHim}
                      comm={`${exec.commissionRate}%`}
                      earnings={`₹${exec.totalEarnings.toLocaleString()}`}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80">
              <h3 className="font-bold mb-4">Subscriptions Growth</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={barData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80">
              <h3 className="font-bold mb-4 text-center">Revenue Distribution</h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-700 font-bold mb-4">
              <TrendingUp size={20} /> Top Performer
            </div>
            <div className="flex items-center gap-4 mb-4">
              <img 
                className="w-12 h-12 rounded-full border-2 border-white" 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" 
                alt="avatar" 
              />
              <div>
                <p className="font-bold text-lg">Priya Verma</p>
                <p className="text-xs text-gray-500">SP-2025-002</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Salons</span><span className="font-bold">18</span></div>
              <div className="flex justify-between"><span>Subs Sold</span><span className="font-bold">15</span></div>
              <div className="flex justify-between text-emerald-700 font-bold pt-2 border-t border-emerald-200">
                <span>Earned</span><span>₹82,500</span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <div className="flex items-center gap-2 text-red-600 font-bold mb-4">
              <AlertCircle size={20} /> Low Performance
            </div>
            <div className="space-y-3">
              <AlertItem name="Amit Patel" sub="9 salons" />
              <AlertItem name="Vikram Singh" sub="6 salons" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ title, value, trend, icon, color }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between">
    <div>
      <p className="text-sm text-gray-500 mb-1 font-medium">{title}</p>
      <h3 className="text-3xl font-bold mb-2">{value}</h3>
      <p className="text-green-500 text-sm font-bold flex items-center gap-1">
        <TrendingUp size={14} /> {trend}
      </p>
    </div>
    <div className={`${color} text-white p-3 rounded-xl h-fit shadow-lg shadow-gray-200`}>
      {icon}
    </div>
  </div>
);

const TableRow = ({ id, name, salons, comm, earnings }) => (
  <tr className="hover:bg-gray-50 transition text-sm">
    <td className="px-6 py-4 text-purple-600 font-medium">{id}</td>
    <td className="px-6 py-4 font-bold">{name}</td>
    <td className="px-6 py-4 text-center">
      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{salons}</span>
    </td>
    <td className="px-6 py-4 font-bold text-green-600">{comm}</td>
    <td className="px-6 py-4 font-bold">{earnings}</td>
  </tr>
);

const AlertItem = ({ name, sub }) => (
  <div className="bg-white p-3 rounded-xl flex justify-between items-center shadow-sm">
    <div>
      <p className="font-bold text-sm">{name}</p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
    <button className="border border-red-200 text-red-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-50">Notify</button>
  </div>
);

export default SuperAdminDashboard;