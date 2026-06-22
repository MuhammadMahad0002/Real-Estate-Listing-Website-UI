import { motion } from "motion/react";
import { Building2, MapPin, ShieldCheck, Bell, Star, Users } from "lucide-react";

interface HomePageProps {
  onExplore: () => void;
  onSignup: () => void;
  isLoggedIn: boolean;
}

const FEATURES = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Verified Listings",
    desc: "Every property is verified by our team. No fake listings, no wasted trips — just genuine opportunities.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Exclusive Properties",
    desc: "Access premium listings in DHA, Bahria Town, Clifton, and F-7 before they go public.",
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Instant Alerts",
    desc: "Set your criteria and get instant notifications when matching properties are listed.",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Map-Based Search",
    desc: "Explore properties geographically and find what's available near schools, markets, and hospitals.",
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "Market Insights",
    desc: "Real-time PKR price trends by city, sector, and property type to help you invest wisely.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Agent Network",
    desc: "Our 2,000+ certified agents across Pakistan are ready to guide your property journey.",
  },
];

const STATS = [
  { value: "12,000+", label: "Properties Listed" },
  { value: "47",      label: "Cities Covered"   },
  { value: "2,000+",  label: "Certified Agents"  },
  { value: "50,000+", label: "Happy Families"    },
];

export function HomePage({ onExplore, onSignup, isLoggedIn }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ──────────────────────────────────── */}
      <section
        className="relative flex items-center justify-center"
        style={{
          minHeight: "100vh",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&h=1080&fit=crop&auto=format&q=85)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(10,22,40,0.88) 0%, rgba(10,22,40,0.65) 50%, rgba(10,22,40,0.45) 100%)",
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4A853]/40 bg-[#D4A853]/12 mb-8">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A853]" />
              <span
                className="text-[#D4A853] text-xs tracking-wide"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
              >
                Pakistan's Most Trusted Property Platform
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-white mb-5"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: "clamp(2.6rem, 6vw, 4.2rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Find Your Dream<br />
              <span style={{ color: "#D4A853" }}>Home in Pakistan</span>
            </h1>

            {/* Subtext */}
            <p
              className="text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(15px, 2vw, 18px)" }}
            >
              Browse thousands of verified properties — houses, apartments, plots, and commercial spaces
              across Pakistan's top cities. Trusted by over 50,000 families.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onExplore}
                className="px-8 py-4 rounded-xl text-[#0A1628] transition-all hover:brightness-110 hover:scale-[1.03] active:scale-100"
                style={{
                  background: "#D4A853",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                Browse Properties →
              </button>
              {!isLoggedIn && (
                <button
                  onClick={onSignup}
                  className="px-8 py-4 rounded-xl text-white border border-white/35 hover:border-white/65 hover:bg-white/10 transition-all"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 15 }}
                >
                  Create Free Account
                </button>
              )}
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 mt-16"
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p
                  className="text-[#D4A853]"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "clamp(20px, 3vw, 26px)",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </p>
                <p
                  className="text-white/50 mt-1 uppercase tracking-widest"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 9.5 }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <div className="w-px h-10 bg-white/50" />
          <p className="text-white text-xs tracking-widest uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
            Scroll
          </p>
        </div>
      </section>

      {/* ── WHY PROPKISTAN ───────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p
              className="text-[#D4A853] text-xs uppercase tracking-widest mb-3"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
            >
              Why Choose Us
            </p>
            <h2
              className="text-[#0A1628]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Why PropPakistan?
            </h2>
            <p
              className="text-gray-500 max-w-xl mx-auto mt-3 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 15 }}
            >
              We're Pakistan's most comprehensive real estate platform, connecting buyers, sellers,
              and renters seamlessly across 47 cities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-[#D4A853]/40 hover:shadow-lg transition-all duration-300 cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D4A853]/10 flex items-center justify-center text-[#D4A853] mb-4 group-hover:bg-[#D4A853] group-hover:text-white transition-all duration-300">
                  {f.icon}
                </div>
                <h3
                  className="text-[#0A1628] mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 16 }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-gray-500 text-sm leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED CITIES STRIP ────────────────── */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <p
                className="text-[#D4A853] text-xs uppercase tracking-widest mb-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                Coverage
              </p>
              <h3
                className="text-[#0A1628] mb-3"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                }}
              >
                From Karachi to Peshawar
              </h3>
              <p
                className="text-gray-500 text-sm leading-relaxed mb-5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                PropPakistan covers 47 cities across all four provinces plus AJK and Gilgit-Baltistan.
                Whether you're looking in a metro or a tier-2 city, we have verified listings waiting for you.
              </p>
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[#0A1628] hover:brightness-110 transition-all"
                style={{
                  background: "#D4A853",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                View All Listings →
              </button>
            </div>

            {/* City grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Lahore",     img: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=200&h=140&fit=crop&auto=format" },
                { name: "Karachi",    img: "https://images.unsplash.com/photo-1566296314736-6ebc1f1fb169?w=200&h=140&fit=crop&auto=format" },
                { name: "Islamabad",  img: "https://images.unsplash.com/photo-1609250498914-f97a6ebfe9b9?w=200&h=140&fit=crop&auto=format" },
                { name: "Rawalpindi", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=140&fit=crop&auto=format" },
                { name: "Faisalabad", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=140&fit=crop&auto=format" },
                { name: "Peshawar",   img: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=200&h=140&fit=crop&auto=format" },
              ].map((city) => (
                <button
                  key={city.name}
                  onClick={onExplore}
                  className="relative rounded-xl overflow-hidden group"
                  style={{ width: 120, height: 80 }}
                >
                  <img src={city.img} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400 bg-gray-200" />
                  <div className="absolute inset-0 bg-[#0A1628]/50 group-hover:bg-[#0A1628]/35 transition-colors" />
                  <span
                    className="absolute inset-0 flex items-center justify-center text-white text-xs"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
                  >
                    {city.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────── */}
      <section className="py-20 bg-[#0A1628]">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to Find Your Perfect Property?
          </h2>
          <p
            className="text-white/55 mb-8 leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: 15 }}
          >
            Join over 50,000 Pakistanis who found their dream home through PropPakistan.
            Listings updated in real time, agents available 6 days a week.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="px-10 py-4 rounded-xl text-[#0A1628] transition-all hover:brightness-110"
              style={{
                background: "#D4A853",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              Explore Properties →
            </button>
            {!isLoggedIn && (
              <button
                onClick={onSignup}
                className="px-10 py-4 rounded-xl text-white border border-white/30 hover:border-white/60 hover:bg-white/8 transition-all"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 15 }}
              >
                Sign Up Free
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="bg-[#060E1A] py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#D4A853] flex items-center justify-center">
              <span className="text-[#0A1628] text-xs font-bold">P</span>
            </div>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: 16,
                color: "#fff",
              }}
            >
              Prop<span style={{ color: "#D4A853" }}>Pakistan</span>
            </span>
          </div>
          <p
            className="text-white/35 text-xs"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            © 2026 PropPakistan. All rights reserved. &nbsp;·&nbsp; Lahore · Karachi · Islamabad
          </p>
        </div>
      </footer>
    </div>
  );
}
