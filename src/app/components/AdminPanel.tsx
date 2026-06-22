import { useState } from "react";
import {
  LayoutDashboard, Home, Building2, MapPin, Users, Calendar,
  Eye, LogOut, ArrowLeft, Plus, MoreHorizontal, CheckCircle,
  Clock, TrendingUp, TrendingDown, Phone, Star, Filter,
  Pencil, Trash2, BarChart2, UserCheck, Lock,
} from "lucide-react";
import { motion } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { PROPERTIES } from "./data";

interface AdminPanelProps {
  userName: string | null;
  onLogout: () => void;
  onBack: () => void;
  onNavigateHome?: () => void;
  onChangePassword?: () => void;
}

type Tab = "dashboard" | "properties" | "agents" | "visits" | "add";

/* ── Mock data ─────────────────────────────────────────── */
const INQUIRY_TREND = [
  { month: "Jan", inquiries: 28, visits: 12 },
  { month: "Feb", inquiries: 35, visits: 18 },
  { month: "Mar", inquiries: 42, visits: 24 },
  { month: "Apr", inquiries: 38, visits: 20 },
  { month: "May", inquiries: 55, visits: 31 },
  { month: "Jun", inquiries: 67, visits: 38 },
  { month: "Jul", inquiries: 72, visits: 44 },
];

const CITY_DATA = [
  { city: "Lahore", listings: 5 },
  { city: "Karachi", listings: 3 },
  { city: "Islamabad", listings: 3 },
  { city: "Rawalpindi", listings: 2 },
];

const TYPE_DATA = [
  { name: "House", value: 5, color: "#D4A853" },
  { name: "Apartment", value: 4, color: "#0A1628" },
  { name: "Plot", value: 2, color: "#6B7280" },
  { name: "Commercial", value: 1, color: "#9CA3AF" },
];

const STATUS_MAP = {
  Active:  { bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500", label: "Active" },
  Rented:  { bg: "bg-blue-50",     text: "text-blue-700",    dot: "bg-blue-500",    label: "Rented" },
  Pending: { bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-500",   label: "Pending" },
  Sold:    { bg: "bg-gray-100",    text: "text-gray-500",    dot: "bg-gray-400",    label: "Sold" },
};
type StatusKey = keyof typeof STATUS_MAP;

const PROP_STATUSES: StatusKey[] = [
  "Active","Active","Rented","Active","Pending","Active",
  "Rented","Active","Active","Pending","Active","Active",
];

const MOCK_LISTINGS = PROPERTIES.map((p, i) => ({
  ...p,
  status: PROP_STATUSES[i] ?? "Active",
  views:  [342, 891, 156, 2341, 78, 445, 210, 678, 330, 120, 560, 890][i] ?? 100,
  inquiries: [12, 34, 5, 87, 2, 18, 7, 42, 15, 4, 22, 61][i] ?? 5,
  listed: ["2 days ago","1 week ago","3 days ago","2 weeks ago","1 month ago","5 days ago","4 days ago","10 days ago","1 week ago","3 weeks ago","2 days ago","1 month ago"][i] ?? "—",
}));

const MOCK_AGENTS = [
  { id: 1, name: "Tariq Mehmood",  phone: "+92-321-4567890", city: "Lahore",     listings: 4, visits: 18, rating: 4.8, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" },
  { id: 2, name: "Sana Khalid",    phone: "+92-300-9876543", city: "Rawalpindi", listings: 2, visits: 9,  rating: 4.6, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format" },
  { id: 3, name: "Faraz Ahmed",    phone: "+92-333-1234567", city: "Karachi",    listings: 3, visits: 14, rating: 4.9, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format" },
  { id: 4, name: "Imran Shah",     phone: "+92-311-5551234", city: "Islamabad",  listings: 2, visits: 11, rating: 4.5, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format" },
  { id: 5, name: "Nadia Akhtar",   phone: "+92-300-7778899", city: "Lahore",     listings: 1, visits: 5,  rating: 4.7, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format" },
];

const MOCK_VISITS = [
  { id: 1, client: "Ahmed Raza",    phone: "+92 300 1234567", property: "5-Marla House, DHA Phase 6",          agent: "Tariq Mehmood",  date: "25 Jun 2026", time: "Morning",   status: "Confirmed" },
  { id: 2, client: "Sadia Malik",   phone: "+92 321 9876543", property: "3-Bed Apartment, Clifton",             agent: "Faraz Ahmed",    date: "26 Jun 2026", time: "Afternoon", status: "Pending"   },
  { id: 3, client: "Faisal Khan",   phone: "+92 333 5556667", property: "10-Marla House, Bahria Town",          agent: "Sana Khalid",    date: "26 Jun 2026", time: "Evening",   status: "Confirmed" },
  { id: 4, client: "Noor Fatima",   phone: "+92 345 1112223", property: "Penthouse, Centaurus",                 agent: "Imran Shah",     date: "27 Jun 2026", time: "Morning",   status: "Cancelled" },
  { id: 5, client: "Bilal Chaudhry",phone: "+92 311 4445556", property: "Commercial Space, Gulberg III",        agent: "Nadia Akhtar",   date: "28 Jun 2026", time: "Afternoon", status: "Confirmed" },
  { id: 6, client: "Hina Zafar",    phone: "+92 322 7778889", property: "1-Kanal Bungalow, Cantt",              agent: "Tariq Mehmood",  date: "29 Jun 2026", time: "Morning",   status: "Pending"   },
];

const VISIT_STATUS = {
  Confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  Pending:   { bg: "bg-amber-50",   text: "text-amber-700",   icon: <Clock className="w-3.5 h-3.5" /> },
  Cancelled: { bg: "bg-red-50",     text: "text-red-600",     icon: <TrendingDown className="w-3.5 h-3.5" /> },
};

/* ── NAV ITEMS ─────────────────────────────────────────── */
const NAV = [
  { id: "dashboard"  as Tab, label: "Dashboard",         icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "properties" as Tab, label: "Properties",        icon: <Building2 className="w-4 h-4" />,       badge: MOCK_LISTINGS.filter(l => l.status === "Pending").length },
  { id: "agents"     as Tab, label: "Agents",            icon: <UserCheck className="w-4 h-4" /> },
  { id: "visits"     as Tab, label: "Visit Schedule",    icon: <Calendar className="w-4 h-4" />,        badge: MOCK_VISITS.filter(v => v.status === "Pending").length },
  { id: "add"        as Tab, label: "Add Property",      icon: <Plus className="w-4 h-4" /> },
];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export function AdminPanel({ userName, onLogout, onBack, onNavigateHome, onChangePassword }: AdminPanelProps) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  return (
    <div className="min-h-screen flex" style={{ background: "#F5F7FA" }}>

      {/* ── SIDEBAR ────────────────────────────────── */}
      <aside className="w-60 flex-shrink-0 flex flex-col sticky top-0 h-screen overflow-y-auto" style={{ background: "#0A1628" }}>
        {/* Logo — clickable to go to split landing page */}
        <button onClick={onNavigateHome} className="w-full px-5 pt-6 pb-5 border-b border-white/10 flex-shrink-0 text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4A853] flex items-center justify-center flex-shrink-0">
              <Home className="w-4 h-4 text-[#0A1628]" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 16, color: "#fff" }}>
              Prop<span style={{ color: "#D4A853" }}>Pakistan</span>
            </span>
          </div>
          <p className="text-white/30 text-xs mt-1 ml-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
            Admin Dashboard
          </p>
        </button>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
                style={{
                  background: active ? "rgba(212,168,83,0.18)" : "transparent",
                  color: active ? "#D4A853" : "rgba(255,255,255,0.55)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: active ? 700 : 500,
                }}
                onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)"; } }}
                onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; } }}
              >
                <span className="flex items-center gap-2.5">{item.icon}{item.label}</span>
                {"badge" in item && item.badge ? (
                  <span className="w-5 h-5 rounded-full bg-[#D4A853] text-[#0A1628] text-xs flex items-center justify-center" style={{ fontWeight: 800 }}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 pb-5 border-t border-white/10 pt-4 flex-shrink-0 space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#D4A853] flex items-center justify-center flex-shrink-0">
              <span className="text-[#0A1628] text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
                {userName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{userName}</p>
              <p className="text-white/35 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Property Agent</p>
            </div>
          </div>
          <button onClick={onChangePassword} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-[#D4A853] hover:bg-[#D4A853]/10 text-xs transition-all" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Lock className="w-3.5 h-3.5" />Change Password
          </button>
          <button onClick={onBack} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 text-xs transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
            <ArrowLeft className="w-3.5 h-3.5" />Back to Home
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-400/10 text-xs transition-all" style={{ fontFamily: "'Inter', sans-serif" }}>
            <LogOut className="w-3.5 h-3.5" />Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {tab === "dashboard"  && <DashboardTab onTab={setTab} />}
          {tab === "properties" && <PropertiesTab statusFilter={statusFilter} setStatusFilter={setStatusFilter} />}
          {tab === "agents"     && <AgentsTab />}
          {tab === "visits"     && <VisitsTab />}
          {tab === "add"        && <AddPropertyTab />}
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD TAB
═══════════════════════════════════════════════════════════ */
function DashboardTab({ onTab }: { onTab: (t: Tab) => void }) {
  const total    = MOCK_LISTINGS.length;
  const active   = MOCK_LISTINGS.filter(l => l.status === "Active").length;
  const rented   = MOCK_LISTINGS.filter(l => l.status === "Rented").length;
  const pending  = MOCK_LISTINGS.filter(l => l.status === "Pending").length;
  const totalViews = MOCK_LISTINGS.reduce((a, l) => a + l.views, 0);

  const kpis = [
    { label: "Total Properties", value: total,  icon: <Building2 className="w-5 h-5" />,   delta: "+2 this month",  up: true  },
    { label: "Active Listings",  value: active,  icon: <TrendingUp className="w-5 h-5" />,  delta: "Currently live", up: true  },
    { label: "Rented / Sold",    value: rented,  icon: <CheckCircle className="w-5 h-5" />, delta: "Successfully closed", up: true },
    { label: "Pending Review",   value: pending, icon: <Clock className="w-5 h-5" />,       delta: "Awaiting action", up: false },
    { label: "Total Views",      value: totalViews.toLocaleString(), icon: <Eye className="w-5 h-5" />, delta: "+18% this week", up: true },
    { label: "Visits Booked",    value: MOCK_VISITS.filter(v => v.status === "Confirmed").length, icon: <Calendar className="w-5 h-5" />, delta: "This week", up: true },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
      <PageHeader title="Dashboard" sub="Overview of your property portfolio and performance." />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4A853]/15 flex items-center justify-center text-[#D4A853]">{k.icon}</div>
              {k.up ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-amber-500" />}
            </div>
            <p className="text-[#0A1628] mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 24 }}>{k.value}</p>
            <p className="text-gray-400 text-xs mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{k.label}</p>
            <p className={`text-xs ${k.up ? "text-emerald-600" : "text-amber-600"}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{k.delta}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Inquiries & Visits trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <ChartHeader title="Inquiries & Visits" sub="Last 7 months" icon={<BarChart2 className="w-4 h-4 text-[#D4A853]" />} />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={INQUIRY_TREND} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gInq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#D4A853" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gVis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0A1628" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0A1628" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="inquiries" stroke="#D4A853" strokeWidth={2.5} fill="url(#gInq)" name="Inquiries" dot={false} />
              <Area type="monotone" dataKey="visits"    stroke="#0A1628" strokeWidth={2}   fill="url(#gVis)" name="Visits"    dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Property type donut */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <ChartHeader title="By Type" sub="Portfolio breakdown" icon={<Building2 className="w-4 h-4 text-[#D4A853]" />} />
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={TYPE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {TYPE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {TYPE_DATA.map((t) => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                  <span className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>{t.name}</span>
                </div>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: "#0A1628" }}>{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* City bar chart + availability split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Listings by city */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <ChartHeader title="Listings by City" sub="Current portfolio" icon={<MapPin className="w-4 h-4 text-[#D4A853]" />} />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={CITY_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="city" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="listings" name="Listings" radius={[6, 6, 0, 0]}>
                {CITY_DATA.map((_, i) => <Cell key={i} fill={i === 0 ? "#D4A853" : "#0A1628"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Availability status split */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <ChartHeader title="Availability Status" sub="Portfolio health" icon={<TrendingUp className="w-4 h-4 text-[#D4A853]" />} />
          <div className="space-y-3 mt-2">
            {[
              { label: "Available / Active", count: active,  pct: Math.round((active  / total) * 100), color: "#10B981" },
              { label: "Rented / Sold",      count: rented,  pct: Math.round((rented  / total) * 100), color: "#3B82F6" },
              { label: "Pending Review",     count: pending, pct: Math.round((pending / total) * 100), color: "#F59E0B" },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>{row.label}</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: "#0A1628" }}>{row.count} ({row.pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${row.pct}%`, background: row.color }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
            {total} total properties in portfolio
          </p>
        </div>
      </div>

      {/* Recent visits */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <SectionTitle>Upcoming Visits</SectionTitle>
          <button onClick={() => onTab("visits")} className="text-[#D4A853] text-xs hover:underline" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>View all →</button>
        </div>
        {MOCK_VISITS.slice(0, 4).map((v) => <VisitRow key={v.id} visit={v} />)}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROPERTIES TAB
═══════════════════════════════════════════════════════════ */
function PropertiesTab({ statusFilter, setStatusFilter }: { statusFilter: string; setStatusFilter: (s: string) => void }) {
  const statuses = ["All", "Active", "Rented", "Pending", "Sold"];
  const filtered = statusFilter === "All" ? MOCK_LISTINGS : MOCK_LISTINGS.filter(l => l.status === statusFilter);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
      <PageHeader title="Property Management" sub={`${MOCK_LISTINGS.length} properties in your portfolio`} />

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="px-4 py-1.5 rounded-full text-xs transition-all"
            style={{
              background: statusFilter === s ? "#0A1628" : "#fff",
              color: statusFilter === s ? "#fff" : "#6B7280",
              border: `1px solid ${statusFilter === s ? "#0A1628" : "#E5E7EB"}`,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid px-5 py-3 border-b border-gray-100" style={{ gridTemplateColumns: "56px 1fr 120px 80px 90px 60px" }}>
          {["", "Property", "Status", "Views", "Inquiries", ""].map((h) => (
            <span key={h} className="text-[10px] uppercase tracking-widest text-gray-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{h}</span>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-14 text-gray-400 text-sm">No properties match this filter.</div>
        )}
        {filtered.map((p) => {
          const s = STATUS_MAP[p.status as StatusKey] ?? STATUS_MAP.Active;
          return (
            <div key={p.id} className="flex flex-col md:grid gap-4 items-center px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              style={{ gridTemplateColumns: "56px 1fr 120px 80px 90px 60px" }}>
              <img src={p.image} alt={p.title} className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              <div className="min-w-0">
                <p className="text-[#0A1628] text-sm truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{p.title}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#D4A853]" />
                  <span className="text-gray-400 text-xs truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{p.location}</span>
                </div>
                <p className="text-[#D4A853] text-xs mt-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{p.priceLabel}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs ${s.bg} ${s.text}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
              </span>
              <div className="flex items-center gap-1 text-gray-500">
                <Eye className="w-3.5 h-3.5" />
                <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{p.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Users className="w-3.5 h-3.5" />
                <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{p.inquiries}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0A1628] transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AGENTS TAB
═══════════════════════════════════════════════════════════ */
function AgentsTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
      <PageHeader title="Manage Agents" sub={`${MOCK_AGENTS.length} agents in your network`} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_AGENTS.map((agent, i) => (
          <motion.div key={agent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={agent.img} alt={agent.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#D4A853] bg-gray-100" onError={(e) => { (e.currentTarget as HTMLImageElement).src = ""; }} />
                <div>
                  <p className="text-[#0A1628] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{agent.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#D4A853]" />
                    <span className="text-gray-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{agent.city}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 text-[#D4A853] fill-[#D4A853]" />
                <span className="text-xs text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{agent.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#F5F7FA] rounded-xl p-3 text-center">
                <p className="text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20 }}>{agent.listings}</p>
                <p className="text-gray-400 text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>Listings</p>
              </div>
              <div className="bg-[#F5F7FA] rounded-xl p-3 text-center">
                <p className="text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20 }}>{agent.visits}</p>
                <p className="text-gray-400 text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>Visits Done</p>
              </div>
            </div>

            <a href={`tel:${agent.phone}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 text-[#0A1628] text-xs hover:bg-[#0A1628] hover:text-white hover:border-[#0A1628] transition-all"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
              <Phone className="w-3.5 h-3.5" />{agent.phone}
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VISITS TAB
═══════════════════════════════════════════════════════════ */
function VisitsTab() {
  const confirmed = MOCK_VISITS.filter(v => v.status === "Confirmed").length;
  const pending   = MOCK_VISITS.filter(v => v.status === "Pending").length;
  const cancelled = MOCK_VISITS.filter(v => v.status === "Cancelled").length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
      <PageHeader title="Visit Schedule" sub="Track all scheduled property visits" />

      {/* Summary pills */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { label: "Confirmed", count: confirmed, color: "emerald" },
          { label: "Pending",   count: pending,   color: "amber"   },
          { label: "Cancelled", count: cancelled, color: "red"     },
        ].map((s) => (
          <div key={s.label} className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-${s.color}-50 border border-${s.color}-100`}>
            <span className={`w-2 h-2 rounded-full bg-${s.color}-500`} />
            <span className={`text-${s.color}-700 text-sm`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{s.count} {s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:grid px-5 py-3 border-b border-gray-100" style={{ gridTemplateColumns: "1fr 1fr 1fr 110px 110px" }}>
          {["Client", "Property", "Agent", "Date & Time", "Status"].map((h) => (
            <span key={h} className="text-[10px] uppercase tracking-widest text-gray-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{h}</span>
          ))}
        </div>
        {MOCK_VISITS.map((v) => <VisitRow key={v.id} visit={v} showFull />)}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADD PROPERTY TAB
═══════════════════════════════════════════════════════════ */
function AddPropertyTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
      <PageHeader title="Add New Property" sub="Fill in the details to publish a new listing." />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Property Title"  placeholder="e.g. 5-Marla House in DHA Phase 6" />
          <FormField label="Price (PKR)"     placeholder="e.g. 28500000" type="number" />
          <FormField label="Location / Area" placeholder="e.g. DHA Phase 6, Lahore" />
          <SelectField label="City"          options={["Lahore","Karachi","Islamabad","Rawalpindi","Faisalabad"]} />
          <FormField label="Bedrooms"        placeholder="e.g. 4" type="number" />
          <FormField label="Bathrooms"       placeholder="e.g. 3" type="number" />
          <FormField label="Area"            placeholder="e.g. 10" type="number" />
          <SelectField label="Area Unit"     options={["Marla","Kanal","Sqft"]} />
          <SelectField label="Property Type" options={["House","Apartment","Plot","Commercial"]} />
          <SelectField label="Furnishing"    options={["Furnished","Semi-Furnished","Unfurnished"]} />
          <SelectField label="Assign Agent"  options={MOCK_AGENTS.map(a => a.name)} />
          <SelectField label="Status"        options={["Active","Pending"]} />
        </div>

        <div>
          <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>Description</label>
          <textarea rows={4} placeholder="Describe the property — location benefits, features, nearby amenities..." className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-[#F5F7FA] text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#D4A853] transition-colors resize-none" style={{ fontFamily: "'Inter', sans-serif" }} />
        </div>

        <div>
          <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>Photos</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#D4A853] transition-colors cursor-pointer bg-[#F5F7FA]">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-[#0A1628] text-sm mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>Upload property photos</p>
            <p className="text-gray-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Drag & drop or click — PNG, JPG up to 10MB each</p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button className="px-6 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
            Save as Draft
          </button>
          <button className="flex-1 py-3 rounded-xl text-[#0A1628] text-sm transition-all hover:brightness-110" style={{ background: "#D4A853", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
            Publish Listing
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── SHARED PRIMITIVES ─────────────────────────────────── */
function VisitRow({ visit, showFull }: { visit: typeof MOCK_VISITS[0]; showFull?: boolean }) {
  const s = VISIT_STATUS[visit.status as keyof typeof VISIT_STATUS] ?? VISIT_STATUS.Pending;
  if (showFull) {
    return (
      <div className="grid px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors items-center gap-4"
        style={{ gridTemplateColumns: "1fr 1fr 1fr 110px 110px" }}>
        <div>
          <p className="text-[#0A1628] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{visit.client}</p>
          <p className="text-gray-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{visit.phone}</p>
        </div>
        <p className="text-gray-600 text-xs truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{visit.property}</p>
        <p className="text-gray-500 text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>{visit.agent}</p>
        <div>
          <p className="text-[#0A1628] text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{visit.date}</p>
          <p className="text-gray-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{visit.time}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs ${s.bg} ${s.text}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
          {s.icon}{visit.status}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
      <div className="w-8 h-8 rounded-full bg-[#0A1628] flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{visit.client.charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#0A1628] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{visit.client}</p>
        <p className="text-gray-400 text-xs truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{visit.property} · {visit.agent}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[#0A1628] text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{visit.date}</p>
        <p className="text-gray-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{visit.time}</p>
      </div>
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs flex-shrink-0 ${s.bg} ${s.text}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
        {s.icon}{visit.status}
      </span>
    </div>
  );
}

function PageHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-7">
      <h1 className="text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 24 }}>{title}</h1>
      <p className="text-gray-500 text-sm mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{sub}</p>
    </div>
  );
}

function ChartHeader({ title, sub, icon }: { title: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 14 }}>{title}</p>
        <p className="text-gray-400 text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{sub}</p>
      </div>
      {icon}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 14 }}>{children}</h3>;
}

function FormField({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{label}</label>
      <input type={type} placeholder={placeholder} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-[#F5F7FA] text-sm placeholder-gray-400 outline-none focus:border-[#D4A853] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }} />
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{label}</label>
      <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-[#F5F7FA] text-sm text-[#0A1628] outline-none focus:border-[#D4A853] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
