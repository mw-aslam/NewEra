'use client';

import { useMemo } from 'react';
import type { LocalProfile, LocalPayment, LocalLessonProgress, LocalTestAttempt } from '@/types/admin';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  PlayCircle, 
  Award, 
  Percent,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface AdminAnalyticsClientProps {
  profiles: LocalProfile[];
  payments: LocalPayment[];
  progress: LocalLessonProgress[];
  testAttempts: LocalTestAttempt[];
}

export default function AdminAnalyticsClient({
  profiles,
  payments,
  progress,
  testAttempts,
}: AdminAnalyticsClientProps) {
  // Aggregate revenue by date (last 7 days)
  const revenueChartData = useMemo(() => {
    const map: Record<string, number> = {};
    const dates = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });

    dates.forEach((date) => {
      map[date] = 0;
    });

    payments
      .filter((p) => p.status === 'approved')
      .forEach((p) => {
        const date = p.created_at.slice(0, 10);
        if (map[date] !== undefined) {
          map[date] += p.amount;
        }
      });

    return dates.map((date) => ({
      date: date.slice(5),
      revenue: map[date],
    }));
  }, [payments]);

  // Aggregate user registrations by date
  const registrationChartData = useMemo(() => {
    const map: Record<string, number> = {};
    const dates = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });

    dates.forEach((date) => {
      map[date] = 0;
    });

    profiles.forEach((p) => {
      const date = p.created_at.slice(0, 10);
      if (map[date] !== undefined) {
        map[date] += 1;
      }
    });

    return dates.map((date) => ({
      date: date.slice(5),
      users: map[date],
    }));
  }, [profiles]);

  // Level breakdown distribution
  const levelDistribution = useMemo(() => {
    const counts: Record<string, number> = { Beginner: 0, Intermediate: 0, Advanced: 0, Pro: 0 };
    profiles.forEach((p) => {
      const lvl = p.level || 'Beginner';
      counts[lvl] = (counts[lvl] || 0) + 1;
    });

    return [
      { name: 'Beginner', value: counts['Beginner'], color: '#ffffff' },
      { name: 'Pro', value: counts['Pro'], color: '#888888' },
      { name: 'VIP', value: counts['Advanced'] + counts['Intermediate'], color: '#444444' },
    ];
  }, [profiles]);

  // KPIs
  const totalUsers = profiles.length;
  const approvedPayments = payments.filter((p) => p.status === 'approved');
  const paidUsersCount = new Set(approvedPayments.map((p) => p.user_id)).size;
  const totalRevenue = approvedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalTestAttempts = testAttempts.length;
  const passedTests = testAttempts.filter((t) => t.passed).length;
  const averageTestScore = totalTestAttempts > 0
    ? Math.round(testAttempts.reduce((sum, t) => sum + t.score, 0) / totalTestAttempts)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-3xl font-black text-white tracking-tight">Platforma Chuqur Analitikasi</h1>
        <p className="text-white/50 text-sm">Daromad oqimi, konversiya, talabalar faolligi va test ko&apos;rsatkichlari.</p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#000000] border border-white/15 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">Jami daromad</span>
            <DollarSign size={18} className="text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {new Intl.NumberFormat('uz-UZ').format(totalRevenue)} UZS
          </div>
          <span className="text-[11px] text-white/40 mt-1 block">Tasdiqlangan buyurtmalar</span>
        </div>

        <div className="bg-[#000000] border border-white/15 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">Foydalanuvchilar</span>
            <Users size={18} className="text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{totalUsers}</div>
          <span className="text-[11px] text-white/40 mt-1 block">{paidUsersCount} ta sotib olgan talaba</span>
        </div>

        <div className="bg-[#000000] border border-white/15 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">Test o&apos;tish koeffitsiyenti</span>
            <Percent size={18} className="text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalTestAttempts > 0 ? Math.round((passedTests / totalTestAttempts) * 100) : 0}%
          </div>
          <span className="text-[11px] text-white/40 mt-1 block">{passedTests} / {totalTestAttempts} ta o&apos;tgan</span>
        </div>

        <div className="bg-[#000000] border border-white/15 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">O&apos;rtacha test bali</span>
            <Award size={18} className="text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{averageTestScore}%</div>
          <span className="text-[11px] text-white/40 mt-1 block">Min talab: 90%</span>
        </div>
      </div>

      {/* Recharts Graphs: Revenue & Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend Chart */}
        <div className="bg-[#000000] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">So&apos;nggi 7 kunlik tushum</h3>
              <p className="text-xs text-white/40">Kunlik tasdiqlangan to&apos;lovlar grafigi</p>
            </div>
            <TrendingUp size={20} className="text-white" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Registrations Chart */}
        <div className="bg-[#000000] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Yangi a&apos;zolar dinamikasi</h3>
              <p className="text-xs text-white/40">Kunlik ro&apos;yxatdan o&apos;tishlar</p>
            </div>
            <Users size={20} className="text-white" />
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={registrationChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="users" fill="#ffffff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
