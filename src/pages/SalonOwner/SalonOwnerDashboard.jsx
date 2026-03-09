import React, { memo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { checkSubscription } from "../../utils/checkSubscription";
import {
  Search,
  Bell,
  Store,
  CheckCircle,
  MapPin,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  ClipboardList,
  BarChart3,
  Clock,
  HelpCircle,
} from "lucide-react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// --- Mock Data ---

const activityData = [
  { name: "Jan", salons: 15, subs: 10 },
  { name: "Feb", salons: 20, subs: 18 },
  { name: "Mar", salons: 30, subs: 25 },
  { name: "Apr", salons: 40, subs: 32 },
  { name: "May", salons: 50, subs: 38 },
  { name: "Jun", salons: 30, subs: 42 },
  { name: "Jul", salons: 40, subs: 48 },
  { name: "Aug", salons: 60, subs: 55 },
];

const salonsData = [
  { id: "1", name: "Style Elegante", subId: "SP-JPM-005", area: "Jayanagar", subArea: "Ayanagar", serviceType: "In-Salon", typeColor: "bg-green-100 text-green-700", plan: "Premium", status: "Active", statusColor: "bg-emerald-500 text-white", date: "25 Mar, 201" },
  { id: "2", name: "Spaxpress Salon", subId: "SP-SLR-034", area: "Jayanagar", subArea: "Jayanagar", serviceType: "Premium", typeColor: "bg-purple-100 text-purple-700", plan: "Premium", status: "Active", statusColor: "bg-emerald-500 text-white", date: "26 Mar, 201" },
  { id: "3", name: "Golden Mirror", subId: "SP-BLR-031", area: "Indiranagar", subArea: "Jayanagar", serviceType: "In-Salon", typeColor: "bg-green-100 text-green-700", plan: "Basic", status: "Pro", statusColor: "bg-purple-600 text-white", date: "25 Mar, 201" },
  { id: "4", name: "Glamour Touch Spa", subId: "SP-SAL-215", area: "Jayanagar", subArea: "Jayanagar", serviceType: "In-Salon", typeColor: "bg-green-100 text-green-700", plan: "Pro", status: "Trial", statusColor: "bg-blue-500 text-white", date: "21 Mar, 201" },
  { id: "5", name: "StyleLight Salon", subId: "SP-MAL-179", area: "Malleswaram", subArea: "Bangalore", serviceType: "In-Salon", typeColor: "bg-green-100 text-green-700", plan: "Pro", status: "Pro", statusColor: "bg-purple-600 text-white", date: "21 Mar, 201" },
];

const alertsData = [
  { id: "SP-SAL-331", name: "Golden Mirror Salon", location: "Jayanagar", score: 42 },
  { id: "SP-MAL-215", name: "StyleLight Salon", location: "Malleswaram, Bangalore", score: 37 },
  { id: "SP-SAL-235", name: "SimplyStrands Unisex", location: "Banaswadi, Bangalore", score: 37 },
  { id: "SP-SAL-175", name: "Starlight Spa", location: "Benson Town, Bangalore", score: 37 },
];

const pieData = [
  { name: "Remaining", value: 57, color: "#d8b4fe" },
  { name: "Achieved", value: 43, color: "#9333ea" },
];

const visitPieData = [
  { name: "Pending", value: 54, color: "#a855f7" },
  { name: "Completed", value: 46, color: "#f3e8ff" },
];


const SalonOwnerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.skipSubscriptionCheck) return;
    checkSubscription(navigate);
  }, [navigate, location]);

  return (
    <div className="p-6 w-full max-w-[1600px] mx-auto">

      {/* 1. Top Header Bar */}
      <header className="flex flex-col xl:flex-row justify-between items-center mb-8 gap-6 bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-sm">
        {/* Left: Search Bar */}
        <div className="relative w-full xl:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-12 pr-4 py-3 bg-white/80 border border-purple-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-base shadow-inner"
          />
        </div>

        {/* Center: Location indicator */}
        <div className="flex items-center gap-2 bg-white/80 px-6 py-3 rounded-full border border-purple-50 text-gray-600 shadow-sm">
          <MapPin size={20} className="text-purple-600" />
          <span className="font-bold whitespace-nowrap">Jayanagar, Bangalore</span>
          <ChevronDown size={18} className="text-gray-400 ml-1" />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4 w-full xl:w-auto justify-center xl:justify-end">
          <div className="bg-[#8b5cf6] text-white px-6 py-3 rounded-full font-bold text-base flex items-center gap-2 shadow-lg hover:shadow-purple-200 transition-all cursor-pointer">
            ₹ 25,000
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-3 bg-white hover:bg-purple-50 rounded-full border border-purple-100 text-purple-600 transition-colors shadow-sm ring-4 ring-white/50">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-3 bg-white hover:bg-purple-50 rounded-full border border-purple-100 text-purple-600 transition-colors shadow-sm ring-4 ring-white/50">
              <MessageSquare size={22} />
            </button>
            <div className="flex items-center gap-2 pl-2">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi"
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-purple-200 bg-white"
              />
              <img src="https://flagcdn.com/w40/in.png" alt="IN" className="w-6 h-4 rounded shadow-sm opacity-80" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total Salons */}
        <div className="bg-white p-6 rounded-2xl border border-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] flex items-center justify-between group hover:translate-y-[-2px] transition-all">
          <div>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">Total Salons Registered</p>
            <h3 className="text-4xl font-black text-gray-800 tracking-tight">48</h3>
          </div>
          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-[18px] flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-inner">
            <Store size={28} />
          </div>
        </div>

        {/* Card 2: Active Subscriptions */}
        <div className="bg-white p-6 rounded-2xl border border-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] flex items-center justify-between group hover:translate-y-[-2px] transition-all">
          <div>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">Active Subscriptions</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-gray-800 tracking-tight">32</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase">₹ 2,60,000 <span className="text-emerald-500">Earnings</span></p>
            </div>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner ring-8 ring-emerald-50/50">
            <CheckCircle size={24} />
          </div>
        </div>

        {/* Card 3: Pending Followups */}
        <div className="bg-white p-6 rounded-2xl border border-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] flex items-center justify-between group hover:translate-y-[-2px] transition-all">
          <div>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">Pending Followups</p>
            <h3 className="text-4xl font-black text-gray-800 tracking-tight">11</h3>
          </div>
          <div className="w-14 h-14 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center shadow-inner ring-8 ring-orange-50/50">
            <Clock size={24} />
          </div>
        </div>

        {/* Card 4: This Month Commission */}
        <div className="bg-white p-6 rounded-2xl border border-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] flex items-center justify-between group hover:translate-y-[-2px] transition-all relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">This Month Commission</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-gray-800 tracking-tight">₹ 18,500</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">Earnings</p>
            </div>
          </div>
          <div className="w-14 h-14 bg-purple-50 text-purple-400 rounded-2xl flex items-center justify-center shadow-inner relative z-10">
            <TrendingUp size={24} />
          </div>
          {/* Abstract background graphics (mimicking coins in the ref) */}
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <BarChart3 size={120} weight="fill" />
          </div>
        </div>
      </div>

      {/* 3. Main Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* --- Left 8 Columns (Charts & Table) --- */}
        <div className="lg:col-span-8 space-y-8">

          {/* Registration Activity Section */}
          <div className="bg-white rounded-[24px] border border-white shadow-xl shadow-purple-900/5 p-6 h-[420px] flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-10 relative z-10">
              <h3 className="text-xl font-black text-gray-800 tracking-tight">Registration Activity</h3>
              <div className="flex bg-gray-100/50 p-1 rounded-lg border border-gray-100">
                <button className="text-[11px] font-bold px-4 py-1.5 text-gray-400 hover:text-purple-600 transition-colors">This Week</button>
                <button className="text-[11px] font-bold px-4 py-1.5 bg-white text-purple-600 rounded-md shadow-sm border border-gray-200">This Month</button>
              </div>
            </div>

            <div className="flex-1 w-full min-h-0 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={activityData} margin={{ top: 0, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#9CA3AF', fontWeight: 'bold' }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#9CA3AF', fontWeight: 'bold' }} />
                  <Tooltip
                    cursor={{ fill: '#F5F3FF' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" align="left" iconType="circle" wrapperStyle={{ paddingTop: '30px', paddingLeft: '20px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }} />

                  <Bar name="Salons Registered" dataKey="salons" fill="#34D399" radius={[6, 6, 0, 0]} maxBarSize={35} opacity={0.6} />
                  <Line name="Subscriptions Activated" type="monotone" dataKey="subs" stroke="#8B5CF6" strokeWidth={4} dot={{ r: 5, strokeWidth: 3, fill: '#fff', stroke: '#8B5CF6' }} activeDot={{ r: 8 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            {/* Soft decorative blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-[80px] -mt-32 -mr-32 opacity-40"></div>
          </div>

          {/* My Registered Salons Table Area */}
          <div className="bg-white rounded-[24px] border border-white shadow-xl shadow-purple-900/5 overflow-hidden flex flex-col">
            <div className="p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-50 gap-4">
              <h3 className="text-xl font-black text-gray-800 tracking-tight">My Registered Salons</h3>
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                <button className="text-[11px] font-black uppercase tracking-widest px-4 py-2 text-purple-600">Active Only</button>
                <div className="w-[1px] h-4 bg-gray-200 self-center"></div>
                <button className="text-[11px] font-black uppercase tracking-widest px-4 py-2 text-gray-400 hover:text-purple-600">This Month</button>
                <div className="w-[1px] h-4 bg-gray-200 self-center"></div>
                <button className="text-[11px] font-black uppercase tracking-widest px-4 py-2 text-purple-600 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center gap-2">
                  By Area <ChevronDown size={14} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto p-4 pt-1">
              <table className="w-full text-left border-separate border-spacing-y-0 min-w-[800px]">
                <thead>
                  <tr className="text-gray-400 text-[11px] font-black uppercase tracking-[2px] text-left">
                    <th className="px-5 py-5 pb-4">Salon Name <ChevronDown size={14} className="inline ml-1" /></th>
                    <th className="px-5 py-5 pb-4">Area <ChevronDown size={14} className="inline ml-1" /></th>
                    <th className="px-5 py-5 pb-4 text-center">Service Type <ChevronDown size={14} className="inline ml-1" /></th>
                    <th className="px-5 py-5 pb-4 text-center">Plan <ChevronDown size={14} className="inline ml-1" /></th>
                    <th className="px-5 py-5 pb-4 text-center">Status <ChevronDown size={14} className="inline ml-1" /></th>
                    <th className="px-5 py-5 pb-4">Reg Date <ChevronDown size={14} className="inline ml-1" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {salonsData.map((salon) => (
                    <tr key={salon.id} className="text-sm hover:bg-purple-50/30 transition-all cursor-pointer group">
                      <td className="px-5 py-5">
                        <div className="font-extrabold text-gray-800 text-[15px] group-hover:text-purple-700 transition-colors">{salon.name}</div>
                        <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1">{salon.subId}</div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="text-gray-700 font-bold">{salon.area}</div>
                        <div className="text-[11px] text-gray-400 font-medium mt-0.5">{salon.subArea}</div>
                      </td>
                      <td className="px-5 py-5 text-center">
                        <span className={`inline-block px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${salon.typeColor} ring-1 ring-inset ring-black/5 shadow-sm`}>
                          {salon.serviceType}
                        </span>
                      </td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-gray-600 font-extrabold">{salon.plan}</span>
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                            <Check size={12} strokeWidth={3} />
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-5 text-center">
                        <span className={`inline-block px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest ${salon.statusColor} shadow-md`}>
                          {salon.status}
                        </span>
                      </td>
                      <td className="px-5 py-5 text-gray-600 font-bold tabular-nums">{salon.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-7 py-6 border-t border-gray-50 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/30">
              <p>Showing 1 - 6 of 48</p>
              <div className="flex gap-2 items-center">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-purple-100 hover:text-purple-600 transition-colors"><ChevronLeft size={16} /></button>
                <div className="flex gap-1">
                  <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-purple-600 text-white font-black shadow-lg shadow-purple-200">1</button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-purple-100 hover:text-purple-600 transition-colors">2</button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-purple-100 hover:text-purple-600 transition-colors">3</button>
                  <span className="flex items-center px-1 font-bold">...</span>
                  <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-purple-100 hover:text-purple-600 transition-colors">79</button>
                </div>
                <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-purple-100 hover:text-purple-600 transition-colors"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Right 4 Columns (Right Panel) --- */}
        <div className="lg:col-span-4 space-y-8">

          {/* Card 1: My Commission Overview */}
          <div className="bg-white rounded-[24px] border border-white shadow-xl shadow-purple-900/5 p-7 relative group">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-lg font-black text-gray-800 tracking-tight">My Commission Overview</h3>
              <button className="bg-purple-50 p-2 rounded-lg text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <HelpCircle size={18} />
              </button>
            </div>

            <div className="flex items-center relative gap-4 mb-2">
              <div className="flex-1 space-y-4 text-[13px] font-bold">
                <div className="flex justify-between border-b border-gray-50 pb-2.5">
                  <span className="text-gray-400">Total Registration</span>
                  <span className="text-gray-800">312</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2.5">
                  <span className="text-gray-400">Active Subscriptions</span>
                  <span className="text-gray-800">214</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2.5">
                  <span className="text-gray-400 text-[11px]">Commission per ActiveSubs</span>
                  <span className="text-gray-800 text-[11px]">₹500</span>
                </div>
                <div className="flex justify-between pt-2 border-t-2 border-purple-50">
                  <span className="text-purple-600">Total Earned</span>
                  <span className="text-2xl font-black text-gray-900 tracking-tighter">₹ 18,500</span>
                </div>
                <div className="flex gap-4 pt-2">
                  <div className="flex-1 p-3 rounded-2xl bg-gray-50/80 border border-gray-100 group/item transition-colors hover:bg-white hover:shadow-md">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Paid</p>
                    <p className="text-sm text-gray-800 font-extrabold">₹ 1,80,000</p>
                    <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden w-full">
                      <div className="h-full bg-emerald-400 w-[70%]" />
                    </div>
                  </div>
                  <div className="flex-1 p-3 rounded-2xl bg-gray-50/80 border border-red-50 group/item transition-colors hover:bg-white hover:shadow-md">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Pending</p>
                    <p className="text-sm text-gray-800 font-extrabold text-red-500">₹ 85,000</p>
                    <div className="mt-2 h-1 bg-red-100 rounded-full overflow-hidden w-full">
                      <div className="h-full bg-red-400 w-[30%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-[120px] h-[120px] absolute -right-4 -top-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={42} outerRadius={58} paddingAngle={4} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.1))` }} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-purple-700 tracking-tighter">43%</span>
                  <span className="text-[10px] font-black text-gray-400 leading-none">₹ 10,500</span>
                </div>
              </div>
            </div>

            {/* Legend for donut */}
            <div className="flex justify-end gap-3 text-[10px] font-black uppercase tracking-widest text-gray-300 mt-4 pr-1">
              <span className="flex items-center gap-1.5 before:w-2 before:h-2 before:bg-purple-600 before:rounded-full">Remaining: 97%</span>
              <span className="flex items-center gap-1.5 before:w-2 before:h-2 before:bg-purple-200 before:rounded-full">Felemring (19-4Q)</span>
            </div>
          </div>

          {/* Card 2: Visit Log Summary */}
          <div className="bg-white rounded-[24px] border border-white shadow-xl shadow-purple-900/5 p-7">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-gray-800 tracking-tight">Visit Log Summary</h3>
              <div className="bg-purple-50 p-2 rounded-lg text-purple-600 shadow-inner">
                <ChevronRight size={18} />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex-1 space-y-3">
                <div className="bg-purple-50/50 p-3 rounded-2xl border border-purple-100/50 flex items-center justify-between group transition-all hover:translate-x-1">
                  <div className="flex items-center gap-2 text-xs text-purple-700 font-black uppercase tracking-widest">
                    <ClipboardList size={16} /> Total Visits
                  </div>
                  <span className="font-black text-purple-900 text-lg tabular-nums">8,125</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex items-center justify-between group transition-all hover:translate-x-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-black uppercase tracking-widest">
                    <Check size={16} className="text-emerald-500" /> Cold wees
                  </div>
                  <span className="font-black text-gray-800 text-lg tabular-nums">2 16,730</span>
                </div>
                <div className="pt-3 pl-4 border-l-4 border-purple-500">
                  <p className="text-[11px] font-black uppercase tracking-[2px] text-purple-600">Converted to Subscription</p>
                  <p className="text-3xl font-black text-gray-900 mt-1 tabular-nums tracking-tighter">6</p>
                </div>
              </div>

              <div className="w-[110px] h-[110px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={visitPieData} innerRadius={35} outerRadius={50} paddingAngle={4} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                      {visitPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-purple-700 tracking-tighter">54%</span>
                  <span className="text-[10px] font-black text-gray-400 leading-none">pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Low Performance Alert */}
          <div className="bg-white rounded-[24px] border border-white shadow-xl shadow-purple-900/5 overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white">
              <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-800">Low Performance Alert</h3>
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center shadow-inner">
                <TrendingUp size={16} className="rotate-180" />
              </div>
            </div>
            <div className="p-2 space-y-1">
              {alertsData.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 py-4 hover:bg-purple-50/50 rounded-2xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${alert.name}`}
                        alt={alert.name}
                        className="w-11 h-11 rounded-2xl bg-gray-100 border-2 border-white shadow-sm ring-1 ring-black/5"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-black text-gray-800 group-hover:text-purple-700 transition-colors uppercase tracking-tight">{alert.name}</p>
                        <span className="text-[9px] text-gray-300 font-black tracking-widest">{alert.id}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-bold tracking-wide mt-0.5">{alert.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-gray-300 py-1.5 px-3 bg-gray-50 rounded-xl font-black text-sm transition-all group-hover:bg-red-50 group-hover:text-red-500 border border-transparent group-hover:border-red-100">
                      <Store size={14} />
                      <span className="tabular-nums">{alert.score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 text-xs font-black uppercase tracking-[3px] text-purple-600 bg-purple-50/50 hover:bg-purple-100 transition-colors">
              View Detailed Report
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default memo(SalonOwnerDashboard);
