import { useState, useEffect } from "react";
import {
  LayoutDashboard, Home, Building2, MapPin, Users, Calendar,
  Eye, LogOut, ArrowLeft, Plus, MoreHorizontal, CheckCircle,
  Clock, TrendingUp, TrendingDown, Phone, Star, Filter,
  Pencil, Trash2, BarChart2, UserCheck, Lock, X, EyeOff, Eye as EyeIcon,
  Search, Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { PROPERTIES } from "../data/data";
import api from "../api/axios";

interface AdminPanelProps {
  userName: string | null;
  onLogout: () => void;
  onBack: () => void;
  onNavigateHome?: () => void;
  onChangePassword?: () => void;
}

type Tab = "dashboard" | "properties" | "agents" | "visits" | "visitAgents" | "add";

/* ── Types ── */
interface VisitAgent {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  role: string;
  createdAt: string;
}

interface Visit {
  _id: string;
  property: { _id: string; title: string; location: string };
  propertyTitle: string;
  propertyAddress: string;
  propertyImage: string;
  customer: { _id: string; fullName: string; email: string; phone: string };
  customerName: string;
  customerPhone: string;
  visitAgent: { _id: string; fullName: string; email: string } | null;
  preferredDate: string;
  timeSlot: string;
  status: string;
  notes: string;
  createdAt: string;
}

interface DashboardStats {
  totalProperties: number;
  totalCustomers: number;
  totalVisitAgents: number;
  totalVisits: number;
  pendingVisits: number;
  completedVisits: number;
  cancelledVisits: number;
}

/* ── Mock data fallbacks ── */
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

const STATUS_MAP: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  Active:  { bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500", label: "Active" },
  Rented:  { bg: "bg-blue-50",     text: "text-blue-700",    dot: "bg-blue-500",    label: "Rented" },
  Pending: { bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-500",   label: "Pending" },
  Sold:    { bg: "bg-gray-100",    text: "text-gray-500",    dot: "bg-gray-400",    label: "Sold" },
};

const PROP_STATUSES: string[] = [
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

const MOCK_VISITS = [
  { id: 1, client: "Ahmed Raza",    phone: "+92 300 1234567", property: "5-Marla House, DHA Phase 6",          agent: "Tariq Mehmood",  date: "25 Jun 2026", time: "Morning",   status: "Confirmed" },
  { id: 2, client: "Sadia Malik",   phone: "+92 321 9876543", property: "3-Bed Apartment, Clifton",             agent: "Faraz Ahmed",    date: "26 Jun 2026", time: "Afternoon", status: "Pending"   },
  { id: 3, client: "Faisal Khan",   phone: "+92 333 5556667", property: "10-Marla House, Bahria Town",          agent: "Sana Khalid",    date: "26 Jun 2026", time: "Evening",   status: "Confirmed" },
  { id: 4, client: "Noor Fatima",   phone: "+92 345 1112223", property: "Penthouse, Centaurus",                 agent: "Imran Shah",     date: "27 Jun 2026", time: "Morning",   status: "Cancelled" },
  { id: 5, client: "Bilal Chaudhry",phone: "+92 311 4445556", property: "Commercial Space, Gulberg III",        agent: "Nadia Akhtar",   date: "28 Jun 2026", time: "Afternoon", status: "Confirmed" },
  { id: 6, client: "Hina Zafar",    phone: "+92 322 7778889", property: "1-Kanal Bungalow, Cantt",              agent: "Tariq Mehmood",  date: "29 Jun 2026", time: "Morning",   status: "Pending"   },
];

const VISIT_STATUS: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  Pending:   { bg: "bg-amber-50",   text: "text-amber-700",   icon: <Clock className="w-3.5 h-3.5" /> },
  Cancelled: { bg: "bg-red-50",     text: "text-red-600",     icon: <TrendingDown className="w-3.5 h-3.5" /> },
};

const VISIT_BADGE: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  assigned: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
};

/* ── NAV ── */
const NAV = [
  { id: "dashboard"    as Tab, label: "Dashboard",        icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "properties"   as Tab, label: "Properties",       icon: <Building2 className="w-4 h-4" />       },
  { id: "visitAgents"  as Tab, label: "Visit Agents",     icon: <UserCheck className="w-4 h-4" />       },
  { id: "visits"       as Tab, label: "All Visits",       icon: <Calendar className="w-4 h-4" />        },
  { id: "agents"       as Tab, label: "Agents (Old)",     icon: <Users className="w-4 h-4" />           },
  { id: "add"          as Tab, label: "Add Property",     icon: <Plus className="w-4 h-4" />            },
];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export function AdminPanel({ userName, onLogout, onBack, onNavigateHome, onChangePassword }: AdminPanelProps) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  return (
    <div className="min-h-screen flex" style={{ background: "#F5F7FA" }}>
      {/* ── SIDEBAR ── */}
      <aside className="w-60 flex-shrink-0 flex flex-col sticky top-0 h-screen overflow-y-auto" style={{ background: "#0A1628" }}>
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
              <p className="text-white/35 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Administrator</p>
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

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {tab === "dashboard"  && <DashboardTab />}
          {tab === "properties" && <PropertiesTab statusFilter={statusFilter} setStatusFilter={setStatusFilter} />}
          {tab === "visitAgents" && <VisitAgentsTab />}
          {tab === "visits"     && <VisitsTab />}
          {tab === "agents"     && <AgentsTab />}
          {tab === "add"        && <AddPropertyTab />}
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD TAB
═══════════════════════════════════════════════════════════ */
function DashboardTab() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/dashboard-stats");
        setStats(res.data);
      } catch {
        // Use fallback
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const total    = MOCK_LISTINGS.length;
  const active   = MOCK_LISTINGS.filter(l => l.status === "Active").length;
  const rented   = MOCK_LISTINGS.filter(l => l.status === "Rented").length;
  const pending  = MOCK_LISTINGS.filter(l => l.status === "Pending").length;
  const totalViews = MOCK_LISTINGS.reduce((a, l) => a + l.views, 0);

  const s = stats;

  const kpis = [
    { label: "Total Properties", value: s?.totalProperties ?? total,  icon: <Building2 className="w-5 h-5" />,   delta: "+2 this month",  up: true  },
    { label: "Total Customers",  value: s?.totalCustomers ?? 0,       icon: <Users className="w-5 h-5" />,       delta: "Registered",     up: true  },
    { label: "Visit Agents",     value: s?.totalVisitAgents ?? 0,     icon: <UserCheck className="w-5 h-5" />,   delta: "Active",         up: true  },
    { label: "Pending Visits",   value: s?.pendingVisits ?? pending,  icon: <Clock className="w-5 h-5" />,       delta: "Needs action",   up: false },
    { label: "Completed Visits", value: s?.completedVisits ?? 0,      icon: <CheckCircle className="w-5 h-5" />, delta: "Done",           up: true  },
    { label: "Total Views",      value: totalViews.toLocaleString(),  icon: <Eye className="w-5 h-5" />,        delta: "+18% this week", up: true  },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
      <PageHeader title="Dashboard" sub="Overview of your property portfolio and performance." />

      {loading ? (
        <div className="p-8 text-center text-gray-400 text-sm">Loading stats...</div>
      ) : (
        <>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
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
        </>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VISIT AGENTS TAB (CRUD)
═══════════════════════════════════════════════════════════ */
function VisitAgentsTab() {
  const [agents, setAgents] = useState<VisitAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editAgent, setEditAgent] = useState<VisitAgent | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/visit-agents");
      setAgents(res.data);
    } catch {
      console.error("Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAgents(); }, []);

  const handleDeactivate = async (id: string) => {
    try {
      await api.delete(`/admin/visit-agents/${id}`);
      setConfirmDelete(null);
      fetchAgents();
    } catch (err) {
      console.error("Failed to toggle agent status", err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 24 }}>Visit Agents</h1>
          <p className="text-gray-500 text-sm mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>Manage your visit agents team.</p>
        </div>
        <button
          onClick={() => { setEditAgent(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[#0A1628] text-sm transition-all hover:brightness-110"
          style={{ background: "#D4A853", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
        >
          <Plus className="w-4 h-4" />Add Visit Agent
        </button>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:grid px-5 py-3 border-b border-gray-100" style={{ gridTemplateColumns: "1fr 1fr 1fr 100px 120px 100px" }}>
          {["Name", "Email", "Phone", "Status", "Created", "Actions"].map((h) => (
            <span key={h} className="text-[10px] uppercase tracking-widest text-gray-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading agents...</div>
        ) : agents.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No visit agents yet. Click "Add Visit Agent" to create one.</div>
        ) : (
          agents.map((agent) => (
            <div key={agent._id} className="flex flex-col md:grid gap-2 md:gap-4 items-start md:items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              style={{ gridTemplateColumns: "1fr 1fr 1fr 100px 120px 100px" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#D4A853] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0A1628] text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>{agent.fullName.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-[#0A1628] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{agent.fullName}</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{agent.email}</p>
              <p className="text-gray-500 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{agent.phone || "—"}</p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs ${agent.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                <span className={`w-1.5 h-1.5 rounded-full ${agent.isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
                {agent.isActive ? "Active" : "Inactive"}
              </span>
              <p className="text-gray-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{new Date(agent.createdAt).toLocaleDateString()}</p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => { setEditAgent(agent); setShowModal(true); }}
                  className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0A1628] transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setConfirmDelete(agent._id)}
                  className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <AgentFormModal
          agent={editAgent}
          onClose={() => { setShowModal(false); setEditAgent(null); }}
          onSuccess={() => { setShowModal(false); setEditAgent(null); fetchAgents(); }}
        />
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A1628]/70 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-[#0A1628] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 16 }}>
              Confirm Action
            </h3>
            <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              Are you sure you want to toggle this agent's active status?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={() => handleDeactivate(confirmDelete)} className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function AgentFormModal({ agent, onClose, onSuccess }: { agent: VisitAgent | null; onClose: () => void; onSuccess: () => void }) {
  const [fullName, setFullName] = useState(agent?.fullName || "");
  const [email, setEmail] = useState(agent?.email || "");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(agent?.phone || "");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) { setError("Full name is required"); return; }
    if (!email.trim()) { setError("Email is required"); return; }
    if (!agent && !password) { setError("Password is required for new agents"); return; }
    if (!agent && password.length < 8) { setError("Password must be at least 8 characters"); return; }

    try {
      setSubmitting(true);
      if (agent) {
        await api.put(`/admin/visit-agents/${agent._id}`, { fullName, email, phone });
      } else {
        await api.post("/admin/visit-agents", { fullName, email, password, phone });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save agent");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0A1628]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 16 }}>
            {agent ? "Edit Visit Agent" : "Add Visit Agent"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>Full Name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Tariq Mehmood"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-[#F5F7FA] text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#D4A853] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }} />
          </div>
          <div>
            <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="agent@example.com"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-[#F5F7FA] text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#D4A853] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }} />
          </div>
          {!agent && (
            <div>
              <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>Password</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-[#F5F7FA] focus-within:border-[#D4A853] transition-colors">
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400" style={{ fontFamily: "'Inter', sans-serif" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>Phone (optional)</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+92 300 1234567"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-[#F5F7FA] text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#D4A853] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-lg text-[#0A1628] text-sm transition-all hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: "#D4A853", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {submitting ? "Saving..." : agent ? "Update Agent" : "Create Agent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VISITS TAB (All Visits with Agent Assignment)
═══════════════════════════════════════════════════════════ */
function VisitsTab() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [agents, setAgents] = useState<VisitAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [visitsRes, agentsRes] = await Promise.all([
        api.get("/admin/visits"),
        api.get("/admin/visit-agents"),
      ]);
      setVisits(visitsRes.data);
      setAgents(agentsRes.data);
    } catch {
      console.error("Failed to fetch visits data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const assignAgent = async (visitId: string, agentId: string) => {
    try {
      await api.put(`/admin/visits/${visitId}/assign`, { visitAgentId: agentId || null });
      fetchData();
    } catch (err) {
      console.error("Failed to assign agent", err);
    }
  };

  const filtered = statusFilter === "All" ? visits : visits.filter(v => v.status === statusFilter.toLowerCase());
  const statuses = ["All", "pending", "assigned", "completed", "cancelled"];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
      <PageHeader title="All Visits" sub="Manage all scheduled property visits." />

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
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:grid px-5 py-3 border-b border-gray-100" style={{ gridTemplateColumns: "1fr 1fr 140px 110px 110px" }}>
          {["Property", "Customer", "Assigned Agent", "Date & Time", "Status"].map((h) => (
            <span key={h} className="text-[10px] uppercase tracking-widest text-gray-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading visits...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No visits found.</div>
        ) : (
          filtered.map((v) => {
            const badge = VISIT_BADGE[v.status] || VISIT_BADGE.pending;
            return (
              <div key={v._id} className="flex flex-col md:grid gap-3 md:gap-4 items-start md:items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                style={{ gridTemplateColumns: "1fr 1fr 140px 110px 110px" }}>
                <div>
                  <p className="text-[#0A1628] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                    {v.propertyTitle || v.property?.title || "Property"}
                  </p>
                  <p className="text-gray-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{v.propertyAddress || v.property?.location}</p>
                </div>
                <div>
                  <p className="text-[#0A1628] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                    {v.customerName || v.customer?.fullName || "Unknown"}
                  </p>
                  <p className="text-gray-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{v.customerPhone || v.customer?.phone}</p>
                </div>
                <div>
                  <select
                    value={v.visitAgent?._id || ""}
                    onChange={(e) => assignAgent(v._id, e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-[#0A1628] bg-white outline-none focus:border-[#D4A853] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">Unassigned</option>
                    {agents.filter(a => a.isActive).map(a => (
                      <option key={a._id} value={a._id}>{a.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-[#0A1628] text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                    {new Date(v.preferredDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{v.timeSlot}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs ${badge.bg} ${badge.text}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                  {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROPERTIES TAB (unchanged)
═══════════════════════════════════════════════════════════ */
function PropertiesTab({ statusFilter, setStatusFilter }: { statusFilter: string; setStatusFilter: (s: string) => void }) {
  const statuses = ["All", "Active", "Rented", "Pending", "Sold"];
  const filtered = statusFilter === "All" ? MOCK_LISTINGS : MOCK_LISTINGS.filter(l => l.status === statusFilter);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
      <PageHeader title="Property Management" sub={`${MOCK_LISTINGS.length} properties in your portfolio`} />

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
        <div className="hidden md:grid px-5 py-3 border-b border-gray-100" style={{ gridTemplateColumns: "56px 1fr 120px 80px 90px 60px" }}>
          {["", "Property", "Status", "Views", "Inquiries", ""].map((h) => (
            <span key={h} className="text-[10px] uppercase tracking-widest text-gray-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{h}</span>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-14 text-gray-400 text-sm">No properties match this filter.</div>
        )}
        {filtered.map((p) => {
          const s = STATUS_MAP[p.status as keyof typeof STATUS_MAP] ?? STATUS_MAP.Active;
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
   AGENTS TAB (original mock data)
═══════════════════════════════════════════════════════════ */
const MOCK_AGENTS = [
  { id: 1, name: "Tariq Mehmood",  phone: "+92-321-4567890", city: "Lahore",     listings: 4, visits: 18, rating: 4.8, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" },
  { id: 2, name: "Sana Khalid",    phone: "+92-300-9876543", city: "Rawalpindi", listings: 2, visits: 9,  rating: 4.6, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format" },
  { id: 3, name: "Faraz Ahmed",    phone: "+92-333-1234567", city: "Karachi",    listings: 3, visits: 14, rating: 4.9, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format" },
  { id: 4, name: "Imran Shah",     phone: "+92-311-5551234", city: "Islamabad",  listings: 2, visits: 11, rating: 4.5, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format" },
  { id: 5, name: "Nadia Akhtar",   phone: "+92-300-7778899", city: "Lahore",     listings: 1, visits: 5,  rating: 4.7, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format" },
];

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
   ADD PROPERTY TAB (unchanged)
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

/* ── SHARED PRIMITIVES ── */
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
