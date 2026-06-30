import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';
import { 
  Sparkles, 
  Star, 
  TrendingUp, 
  MapPin, 
  Car, 
  IndianRupee,
  CheckCircle2
} from 'lucide-react';

export function AnalyticsDashboard({ analytics, loading }) {
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-colors">
        <div className="w-8 h-8 border-3 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-450 dark:text-slate-500 text-sm font-semibold">Computing business analytics...</p>
      </div>
    );
  }

  if (!analytics) return null;

  // 1. Prepare Metric Cards Data
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const metrics = [
    {
      title: 'Total Generations',
      value: analytics.total_generations || 0,
      sub: 'All-time upsell scripts',
      icon: Sparkles,
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20'
    },
    {
      title: 'Average Rating',
      value: `${Number(analytics.average_rating || 0).toFixed(1)} / 5.0`,
      sub: 'Customer satisfaction',
      icon: Star,
      color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20'
    },
    {
      title: 'Success Rate',
      value: `${Number(analytics.success_rate || 0).toFixed(0)}%`,
      sub: 'Rating >= 4 stars',
      icon: CheckCircle2,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20'
    },
    {
      title: 'Revenue Opportunity',
      value: formatCurrency(analytics.revenue_opportunity || 0),
      sub: 'Potential added value',
      icon: IndianRupee,
      color: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/20'
    },
    {
      title: 'Top Destination',
      value: analytics.most_popular_destination || 'N/A',
      sub: 'Most frequent booking',
      icon: MapPin,
      color: 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/20'
    },
    {
      title: 'Most Used Vehicle',
      value: analytics.most_used_vehicle || 'N/A',
      sub: 'Most popular request',
      icon: Car,
      color: 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/20'
    }
  ];

  // 2. Prepare Pie Chart Data (Donut)
  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#059669']; // 1 to 5 stars colors
  const pieData = (analytics.rating_distribution || [])
    .filter(d => d.count > 0)
    .map(d => ({
      name: `${d.rating} Star${d.rating > 1 ? 's' : ''}`,
      value: d.count,
      stars: d.rating
    }));

  // 3. Custom Tooltip for Line/Area Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white border border-slate-850 p-3 rounded-xl shadow-lg text-xs font-semibold">
          <p className="text-slate-400 mb-1">{label}</p>
          <p className="flex items-center gap-1.5 text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
            Generations: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-start justify-between gap-3 shadow-sm transition-colors"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {m.title}
                </span>
                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {m.value}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-450 font-medium">
                  {m.sub}
                </p>
              </div>
              <div className={`p-2 rounded-xl border border-slate-100 dark:border-none shrink-0 ${m.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Line / Area Chart - Daily Usage */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors flex flex-col h-[360px]">
          <h4 className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-500" />
            Daily Usage Trend (Last 30 Days)
          </h4>
          <div className="flex-1 min-h-0">
            {analytics.daily_usage && analytics.daily_usage.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.daily_usage} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 9, fontWeight: 500 }} 
                    stroke="#94a3b8" 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fontSize: 9, fontWeight: 500 }} 
                    stroke="#94a3b8" 
                    axisLine={false} 
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#4f46e5" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-450">No usage records yet.</div>
            )}
          </div>
        </div>

        {/* Pie Chart - Rating Distribution */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors flex flex-col h-[360px]">
          <h4 className="text-xs font-bold text-slate-555 dark:text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500/10" />
            Rating Distribution
          </h4>
          <div className="flex-1 min-h-0 relative flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.stars - 1] || '#cbd5e1'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '12px', 
                      border: 'none', 
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: 600
                    }} 
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-450">No feedback submitted yet.</div>
            )}
          </div>
        </div>

        {/* Bar Chart - Vehicle Types */}
        <div className="lg:col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors flex flex-col h-[320px]">
          <h4 className="text-xs font-bold text-slate-555 dark:text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Car className="w-4 h-4 text-purple-500" />
            Vehicle Class Distribution
          </h4>
          <div className="flex-1 min-h-0">
            {analytics.vehicle_types && analytics.vehicle_types.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.vehicle_types} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                  <XAxis 
                    dataKey="vehicle" 
                    tick={{ fontSize: 9, fontWeight: 600 }} 
                    stroke="#94a3b8" 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fontSize: 9, fontWeight: 500 }} 
                    stroke="#94a3b8" 
                    axisLine={false} 
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }}
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '12px', 
                      border: 'none', 
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: 600
                    }}
                  />
                  <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40}>
                    {analytics.vehicle_types.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#6366f1" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-450">No vehicle rentals recorded.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
export default AnalyticsDashboard;
