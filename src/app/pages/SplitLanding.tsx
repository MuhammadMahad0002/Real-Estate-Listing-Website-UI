import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Home, LogIn, UserPlus } from "lucide-react";

interface SplitLandingProps {
  onExplore: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

type HoveredPanel = "left" | "right" | null;

// Left panel: beautiful modern house exterior – warm, residential feel
const PANEL_LEFT_IMG =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&h=1080&fit=crop&auto=format&q=85";

// Right panel: professional agent/agent desk – aspirational, business-like
const PANEL_RIGHT_IMG =
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1400&h=1080&fit=crop&auto=format&q=85";

export function SplitLanding({ onExplore, onSignIn, onSignUp }: SplitLandingProps) {
  const [hovered, setHovered] = useState<HoveredPanel>(null);

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100dvh", minHeight: "100vh" }}
    >
      {/* ─── LOGO BAR ─────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 z-30 flex flex-col items-center justify-center pt-8 pb-6"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 70%, transparent 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#D4A853" }}
          >
            <Home className="w-4.5 h-4.5 text-black" strokeWidth={2.5} style={{ width: 18, height: 18 }} />
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: "clamp(22px, 3vw, 30px)",
              color: "#ffffff",
              letterSpacing: "-0.015em",
              lineHeight: 1,
            }}
          >
            Prop<span style={{ color: "#D4A853" }}>Pakistan</span>
          </h1>
        </div>
        <p
          className="mt-2.5 tracking-[0.25em] uppercase text-white/50"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 9 }}
        >
          Real Estate · Reimagined
        </p>
      </motion.header>

      {/* ─── AUTH BUTTONS (top-right) ─────────────── */}
      <div className="absolute top-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onSignIn(); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/30 text-white text-sm hover:bg-white/10 transition-all"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, backdropFilter: "blur(4px)" }}
        >
          <LogIn className="w-3.5 h-3.5" />
          Sign In
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onSignUp(); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[#0A1628] text-sm transition-all hover:brightness-110"
          style={{ background: "#D4A853", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
        >
          <UserPlus className="w-3.5 h-3.5" />
          Sign Up
        </button>
      </div>

      {/* ─── PANELS ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row w-full h-full">

        {/* ── PANEL LEFT: Find Your Property ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.08 }}
          className="relative flex-1 overflow-hidden cursor-pointer"
          style={{ minHeight: "50vh" }}
          onMouseEnter={() => setHovered("left")}
          onMouseLeave={() => setHovered(null)}
          onClick={onExplore}
        >
          {/* Photo */}
          <div className="absolute inset-0 bg-[#1a2a1a]">
            <img
              src={PANEL_LEFT_IMG}
              alt="Beautiful modern home in Pakistan"
              className="w-full h-full object-cover"
              style={{
                transform: hovered === "left" ? "scale(1.06)" : "scale(1)",
                transition: "transform 600ms cubic-bezier(0.22,1,0.36,1)",
                willChange: "transform",
                filter: "brightness(0.88)",
              }}
            />
          </div>

          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                hovered === "left"
                  ? "linear-gradient(135deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.38) 55%, rgba(0,0,0,0.15) 100%)"
                  : "linear-gradient(135deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0.08) 100%)",
              transition: "background 400ms ease",
            }}
          />

          <PanelContent
            side="left"
            hovered={hovered === "left"}
            icon={<Home style={{ width: 14, height: 14 }} />}
            label="For Buyers & Tenants"
            headline={<>Find Your<br />Property</>}
            sub="Browse verified homes, plots, and apartments across Pakistan with real-time listings and direct contact to agents."
            cta="Explore Listings"
          />
        </motion.div>

        {/* ── DIVIDER ── */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="hidden md:block relative z-20 flex-shrink-0"
          style={{ width: 1 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                hovered !== null ? "#D4A853" : "rgba(255,255,255,0.22)",
              boxShadow:
                hovered !== null
                  ? "0 0 24px 4px rgba(212,168,83,0.5)"
                  : "none",
              transition: "background 350ms ease, box-shadow 350ms ease",
            }}
          />
        </motion.div>

        {/* ── PANEL RIGHT: List & Manage ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.18 }}
          className="relative flex-1 overflow-hidden cursor-pointer"
          style={{ minHeight: "50vh" }}
          onMouseEnter={() => setHovered("right")}
          onMouseLeave={() => setHovered(null)}
          onClick={onSignIn}
        >
          {/* Photo */}
          <div className="absolute inset-0 bg-[#0a1628]">
            <img
              src={PANEL_RIGHT_IMG}
              alt="Real estate agent managing property listings on a laptop"
              className="w-full h-full object-cover"
              style={{
                transform: hovered === "right" ? "scale(1.06)" : "scale(1)",
                transition: "transform 600ms cubic-bezier(0.22,1,0.36,1)",
                willChange: "transform",
                filter: "brightness(0.82)",
              }}
            />
          </div>

          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                hovered === "right"
                  ? "linear-gradient(225deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.38) 55%, rgba(0,0,0,0.15) 100%)"
                  : "linear-gradient(225deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0.08) 100%)",
              transition: "background 400ms ease",
            }}
          />

          <PanelContent
            side="right"
            hovered={hovered === "right"}
            icon={<LogIn style={{ width: 14, height: 14 }} />}
            label="For Agents & Owners"
            headline={<>Sign In<br />to Manage</>}
            sub="Access your dashboard, manage listings, track visits, and handle all your property operations from one place."
            cta="Sign In → Dashboard"
          />
        </motion.div>
      </div>

      {/* ─── BOTTOM STATS ─────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
          paddingBottom: 24,
          paddingTop: 48,
        }}
      >
        <div className="flex items-center justify-center gap-8 sm:gap-14">
          {[
            { value: "12,000+", label: "Properties" },
            { value: "47", label: "Cities" },
            { value: "2,000+", label: "Agents" },
            { value: "50,000+", label: "Families Served" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 + i * 0.09 }}
              className="text-center"
            >
              <p
                className="text-white"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "clamp(14px, 2vw, 17px)",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </p>
              <p
                className="text-white/45 mt-1 tracking-widest uppercase"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: 8.5,
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── PANEL CONTENT ──────────────────────────────────── */
function PanelContent({
  side,
  hovered,
  icon,
  label,
  headline,
  sub,
  cta,
}: {
  side: "left" | "right";
  hovered: boolean;
  icon: React.ReactNode;
  label: string;
  headline: React.ReactNode;
  sub: string;
  cta: string;
}) {
  const delay = side === "left" ? 0.3 : 0.42;

  return (
    <div className="relative z-10 flex flex-col justify-end h-full px-8 pb-16 sm:px-12 sm:pb-24">
      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay, ease: "easeOut" }}
        className="flex items-center gap-2 mb-5"
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            border: `1px solid ${hovered ? "#D4A853" : "rgba(255,255,255,0.35)"}`,
            background: hovered ? "rgba(212,168,83,0.14)" : "rgba(255,255,255,0.08)",
            transition: "all 320ms ease",
          }}
        >
          <span style={{ color: hovered ? "#D4A853" : "rgba(255,255,255,0.75)", transition: "color 320ms ease" }}>
            {icon}
          </span>
          <span
            className="uppercase tracking-[0.14em]"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: 10,
              color: hovered ? "#D4A853" : "rgba(255,255,255,0.75)",
              transition: "color 320ms ease",
            }}
          >
            {label}
          </span>
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: delay + 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="text-white mb-4 leading-none"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900,
          fontSize: "clamp(2.6rem, 5vw, 4rem)",
          letterSpacing: "-0.025em",
          textShadow: "0 2px 24px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)",
        }}
      >
        {headline}
      </motion.h2>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: delay + 0.18, ease: "easeOut" }}
        className="mb-7 max-w-[280px] leading-relaxed"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          fontSize: "clamp(13px, 1.3vw, 15px)",
          color: "rgba(255,255,255,0.88)",
          lineHeight: 1.7,
          textShadow: "0 1px 8px rgba(0,0,0,0.6)",
        }}
      >
        {sub}
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.28, ease: "easeOut" }}
      >
        <button
          className="inline-flex items-center gap-3 rounded-full"
          style={{
            padding: "12px 28px",
            border: `2px solid ${hovered ? "#D4A853" : "rgba(255,255,255,0.6)"}`,
            background: hovered ? "#D4A853" : "rgba(0,0,0,0.28)",
            color: hovered ? "#0A1628" : "#ffffff",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.03em",
            backdropFilter: "blur(6px)",
            transition: "all 320ms cubic-bezier(0.22,1,0.36,1)",
            cursor: "pointer",
          }}
        >
          {cta}
          <ArrowRight
            style={{
              width: 15,
              height: 15,
              transform: hovered ? "translateX(4px)" : "translateX(0)",
              transition: "transform 320ms ease",
            }}
          />
        </button>
      </motion.div>
    </div>
  );
}
