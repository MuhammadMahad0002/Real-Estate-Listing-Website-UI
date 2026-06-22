import { useNavigate, useLocation } from "react-router-dom";

export default function SimplePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAbout = location.pathname === "/about";

  return (
    <div className="min-h-screen">
      <div
        className="relative py-20 bg-[#0A1628]"
        style={{
          backgroundImage: isAbout
            ? "url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&h=400&fit=crop&auto=format)"
            : "url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=400&fit=crop&auto=format)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#0A1628]/80" />
        <div className="relative z-10 text-center">
          <h1
            className="text-white mb-3"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: 40,
            }}
          >
            {isAbout ? "About PropPakistan" : "Contact Us"}
          </h1>
          <p
            className="text-white/60"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {isAbout
              ? "Pakistan's most trusted real estate platform since 2018"
              : "Get in touch with our expert team"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {isAbout ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Our Mission",
                text: "To make Pakistan's real estate market transparent, accessible, and trustworthy for every buyer and seller across the country.",
              },
              {
                title: "Our Story",
                text: "Founded in Lahore in 2018, PropPakistan grew from a small startup to Pakistan's leading property portal, with listings in 47 cities.",
              },
              {
                title: "Our Team",
                text: "Over 200 dedicated professionals, 2,000+ certified agents, and a technology team committed to innovation in property search.",
              },
              {
                title: "Our Values",
                text: "Transparency, trust, and technology. We believe every Pakistani family deserves easy access to quality housing at fair prices.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <h3
                  className="text-[#D4A853] mb-3"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-gray-600 text-sm leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3
                className="text-[#0A1628] mb-6"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                Get In Touch
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: "📍",
                    label: "Address",
                    value: "14 MM Alam Road, Gulberg III, Lahore",
                  },
                  { icon: "📞", label: "Phone", value: "+92 42 3571 0000" },
                  { icon: "📧", label: "Email", value: "info@propakistan.pk" },
                  { icon: "🕒", label: "Hours", value: "Mon–Sat: 9 AM – 6 PM PKT" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p
                        className="text-xs text-gray-400 mb-0.5"
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="text-[#0A1628] text-sm"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3
                className="text-[#0A1628] mb-4"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                Send a Message
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-[#F5F7FA] text-sm outline-none focus:border-[#D4A853] transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-[#F5F7FA] text-sm outline-none focus:border-[#D4A853] transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <textarea
                  rows={4}
                  placeholder="Your message..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-[#F5F7FA] text-sm outline-none focus:border-[#D4A853] transition-colors resize-none"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  className="w-full py-3 rounded-lg text-[#0A1628] transition-all hover:brightness-110"
                  style={{
                    background: "#D4A853",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/properties")}
            className="px-8 py-3 rounded-xl border-2 border-[#D4A853] text-[#D4A853] hover:bg-[#D4A853] hover:text-[#0A1628] transition-all text-sm"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            ← Browse Properties
          </button>
        </div>
      </div>

      <footer className="bg-[#060E1A] py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p
            className="text-white/40 text-xs"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            © 2026 PropPakistan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
