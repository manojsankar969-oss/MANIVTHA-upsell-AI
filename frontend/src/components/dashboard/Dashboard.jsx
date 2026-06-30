import React from 'react';
import { 
  Sparkles, 
  Star, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  User,
  MapPin,
  Car,
  ChevronRight
} from 'lucide-react';

export function Dashboard({ user, history, analytics, onNavigate, onViewRecord }) {
  
  // 1. Determine Time-Based Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // 2. Count Today's Uses from History
  const getTodaysUses = () => {
    const today = new Date().toDateString();
    return history.filter(item => new Date(item.created_at).toDateString() === today).length;
  };

  // 3. Format Currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const stats = [
    {
      title: 'Total Scripts',
      value: analytics?.total_generations || history.length || 0,
      sub: 'All-time generations',
      icon: Sparkles,
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20'
    },
    {
      title: 'Average Rating',
      value: analytics?.average_rating ? Number(analytics.average_rating).toFixed(1) : 'N/A',
      sub: 'Out of 5.0 stars',
      icon: Star,
      color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20'
    },
    {
      title: "Today's Uses",
      value: getTodaysUses(),
      sub: 'Scripts generated today',
      icon: Clock,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20'
    },
    {
      title: 'Est. Upsell Value',
      value: formatCurrency(analytics?.revenue_opportunity || 0),
      sub: 'Projected uplift (AI + fallback)',
      icon: TrendingUp,
      color: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/20'
    }
  ];

  // Get the 4 most recent generations
  const recentGenerations = history.slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Welcome Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, {user?.name } 👋
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 font-semibold">
            Welcome back. Here is what is happening with your sales upsells today.
          </p>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-start justify-between gap-3 shadow-sm transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {item.title}
                </span>
                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {item.value}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-450 font-medium">
                  {item.sub}
                </p>
              </div>
              <div className={`p-2 rounded-xl shrink-0 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Generations Card */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              Recent Generations
            </h3>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 divide-y divide-slate-100 dark:divide-slate-800">
            {recentGenerations.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-550">
                <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs font-semibold">No scripts generated yet.</p>
                <button
                  onClick={() => onNavigate('generator')}
                  className="mt-3 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-200/40"
                >
                  Create Your First Script
                </button>
              </div>
            ) : (
              recentGenerations.map((item) => (
                <div 
                  key={item.id} 
                  className="py-3.5 flex items-center justify-between gap-4 group hover:bg-slate-50/20 dark:hover:bg-slate-800/20 -mx-2 px-2 rounded-xl transition-all cursor-pointer"
                  onClick={() => onViewRecord(item)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm text-slate-650 dark:text-slate-450 font-bold group-hover:bg-cyan-50 dark:group-hover:bg-cyan-950 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-all">
                      {(item.customer_name || 'C')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.customer_name || 'Customer'}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{item.destination || 'Hyderabad'}</span>
                        <span>•</span>
                        <Car className="w-3 h-3" />
                        <span>{item.vehicle_type || 'Sedan'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {item.rating ? (
                      <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-lg border border-amber-100/30 text-amber-600 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{item.rating}</span>
                      </div>
                    ) : (
                      <span className="text-[9px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-850">
                        Pending
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Upsell Action Card */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Generate New Script Card */}
          <div 
            onClick={() => onNavigate('generator')}
            className="bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 text-white rounded-2xl p-6 shadow-xl shadow-cyan-200/30 dark:shadow-none cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between h-[168px]"
          >
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-100" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight flex items-center gap-1">
                Generate New Script
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-[10px] text-cyan-200 mt-1 leading-relaxed">
                Pitch a premium SUV upgrade or an outstation package to your customer in seconds.
              </p>
            </div>
          </div>

          {/* Explore Templates Card */}
          <div 
            onClick={() => onNavigate('templates')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-500 rounded-2xl p-6 cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between h-[168px]"
          >
            <div className="h-10 w-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
                Explore Templates
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                Use one-click predefined templates for airport transfers, weddings, corporate, or outstation tours.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
export default Dashboard;
