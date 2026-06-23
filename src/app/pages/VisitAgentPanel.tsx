import { useState, useEffect } from "react";
import {
  LayoutDashboard, CalendarCheck, User, Home, LogOut, ArrowLeft,
  Clock, CheckCircle, XCircle, MapPin, Phone, Calendar, Lock,
} from "lucide-react";
import { motion } from "motion/react";
import api from "../api/axios";

interface Visit {
  _id: string;
  property: { _id: string; title: string; location: string; images: string[] };
  propertyTitle: string;
  propertyAddress: string;
  propertyImage: string;
  customer: { _id: string; fullName: string; email: string; phone: string };
  customerName: string;
  customerPhone: string;
  preferredDate: string;
  timeSlot: string;
  status: string;
  notes: string;
  createdAt: string;
}

interface VisitAgentPanelProps {
  userName: string | null;
  userEmail: string;
  userPhone: string;
  onLogout: () => void;
  onBack: () => void;
  onNavigateHome?: () => void;
  onChangePassword?: () => void;
}

type Tab = "dashboard" | "visits" | "profile";

const NAV = [
  { id: "dashboard" as Tab, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "visits" as Tab, label: "My Visits", icon: <CalendarCheck className="w-4 h-4" /> },
  { id: "profile" as Tab, label: "Profile", icon: <User className="w-4 h-4" /> },
];

const STATUS_BADGE: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  assigned: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
};

export function VisitAgentPanel({
  userName, userEmail, userPhone, onLogout, onBack, onNavigateHome, onChangePassword,
}: VisitAgentPanelProps) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const res = await api.get("/visit-agent/my-visits");
      setVisits(res.data);
    } catch (err) {
      console.error("Failed to fetch visits", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "visits" || tab === "dashboard") fetchVisits();
  }, [tab]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/visit-agent/visits/${id}/status`, { status });
      fetchVisits();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const pendingVisits = visits.filter(v => v.status === "assigned").length;
  const completedVisits = visits.filter(v => v.status === "completed").length;
  const cancelledVisits = visits.filter(v => v.status === "cancelled").length;
  const totalAssigned = visits.filter(v => v.status === "assigned" || v.status === "completed" || v.status === "cancelled").length;

  const recentVisits = [...visits].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const getInitial = (name: string) => name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="min-h-screen flex" style={{ background: "#F5F7FA" }}>
      {/* ─── SIDEBAR ─── */}
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
            Visit Agent Panel
          </p>
        </button>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
                style={{
                  background: active ? "rgba(212,168,83,0.18)" : "transparent",
                  color: active ? "#D4A853" : "rgba(255,255,255,0.55)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: active ? 700 : 500,
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; } }}
              >
                {item.icon}{item.label}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 pb-5 border-t border-white/10 pt-4 flex-shrink-0 space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#D4A853] flex items-center justify-center flex-shrink-0">
              <span className="text-[#0A1628] text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
                {getInitial(userName || "")}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{userName}</p>
              <p className="text-white/35 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Visit Agent</p>
            </div>
          </div>
          {onChangePassword && (
            <button onClick={onChangePassword} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-[#D4A853] hover:bg-[#D4A853]/10 text-xs transition-all" style={{ fontFamily: "'Inter', sans-serif" }}>
              <Lock className="w-3.5 h-3.5" />Change Password
            </button>
          )}
          <button onClick={onBack} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 text-xs transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
            <ArrowLeft className="w-3.5 h-3.5" />Back to Home
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-400/10 text-xs transition-all" style={{ fontFamily: "'Inter', sans-serif" }}>
            <LogOut className="w-3.5 h-3.5" />Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {tab === "dashboard" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
              <PageHeader title="Dashboard" sub="Overview of your assigned visits." />

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                {[
                  { label: "Total Assigned", value: totalAssigned, icon: <CalendarCheck className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Pending", value: pendingVisits, icon: <Clock className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Completed", value: completedVisits, icon: <CheckCircle className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Cancelled", value: cancelledVisits, icon: <XCircle className="w-5 h-5" />, color: "text-red-600", bg: "bg-red-50" },
                ].map((k, i) => (
                  <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center ${k.color} mb-3`}>{k.icon}</div>
                    <p className="text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 24 }}>{k.value}</p>
                    <p className="text-gray-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{k.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Visits */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h3 className="text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 14 }}>Recent Visits</h3>
                  <button onClick={() => setTab("visits")} className="text-[#D4A853] text-xs hover:underline" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>View all →</button>
                </div>
                {loading ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
                ) : recentVisits.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">No visits assigned yet.</div>
                ) : (
                  recentVisits.map((v) => (
                    <div key={v._id} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
                          {getInitial(v.customerName || v.customer?.fullName || "")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#0A1628] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                          {v.customerName || v.customer?.fullName || "Unknown"}
                        </p>
                        <p className="text-gray-400 text-xs truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {v.propertyTitle || v.property?.title || "Property"} · {new Date(v.preferredDate).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={v.status} />
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {tab === "visits" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
              <PageHeader title="My Visits" sub="Manage your assigned property visits." />

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="hidden md:grid px-5 py-3 border-b border-gray-100" style={{ gridTemplateColumns: "80px 1fr 1fr 110px 110px 100px" }}>
                  {["Property", "Customer", "Date & Time", "Status", "Actions"].map((h) => (
                    <span key={h} className="text-[10px] uppercase tracking-widest text-gray-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{h}</span>
                  ))}
                </div>

                {loading ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Loading visits...</div>
                ) : visits.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">No visits assigned to you yet.</div>
                ) : (
                  visits.map((v) => {
                    const badge = STATUS_BADGE[v.status] || STATUS_BADGE.pending;
                    return (
                      <div key={v._id} className="flex flex-col md:grid gap-3 md:gap-4 items-start md:items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                        style={{ gridTemplateColumns: "80px 1fr 1fr 110px 110px 100px" }}>
                        {/* Property */}
                        <div className="flex items-center gap-3">
                          <img
                            src={v.propertyImage || v.property?.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=80&fit=crop"}
                            alt={v.propertyTitle || v.property?.title}
                            className="w-16 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                          />
                        </div>

                        {/* Customer */}
                        <div className="min-w-0">
                          <p className="text-[#0A1628] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                            {v.customerName || v.customer?.fullName || "Unknown"}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-[#D4A853]" />
                            <span className="text-gray-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {v.customerPhone || v.customer?.phone || "—"}
                            </span>
                          </div>
                        </div>

                        {/* Date */}
                        <div>
                          <p className="text-[#0A1628] text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                            {new Date(v.preferredDate).toLocaleDateString("en-PK", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                          </p>
                          <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />{v.timeSlot}
                          </p>
                        </div>

                        {/* Status */}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs ${badge.bg} ${badge.text}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />{v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                        </span>

                        {/* Actions */}
                        <div className="flex gap-1.5">
                          {v.status === "assigned" && (
                            <>
                              <button
                                onClick={() => updateStatus(v._id, "completed")}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs hover:bg-emerald-100 transition-colors"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => updateStatus(v._id, "cancelled")}
                                className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs hover:bg-red-100 transition-colors"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {tab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
              <PageHeader title="My Profile" sub="Your account information." />

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-[#D4A853] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 24 }}>
                      {getInitial(userName || "")}
                    </span>
                  </div>
                  <div>
                    <p className="text-[#0A1628]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 18 }}>{userName}</p>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Visit Agent</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <ProfileRow label="Full Name" value={userName || "—"} />
                  <ProfileRow label="Email" value={userEmail || "—"} />
                  <ProfileRow label="Phone" value={userPhone || "—"} />
                  <ProfileRow label="Role" value="Visit Agent" />
                  <ProfileRow label="Assigned Visits" value={String(totalAssigned)} />
                </div>

                {onChangePassword && (
                  <button
                    onClick={onChangePassword}
                    className="mt-6 flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
                  >
                    <Lock className="w-4 h-4" />Change Password
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_BADGE[status] || STATUS_BADGE.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs flex-shrink-0 ${s.bg} ${s.text}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
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

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</span>
      <span className="text-[#0A1628] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{value}</span>
    </div>
  );
}
