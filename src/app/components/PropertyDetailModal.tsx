import { useState } from "react";
import {
  X,
  MapPin,
  Bed,
  Bath,
  Square,
  Phone,
  Car,
  Zap,
  Shield,
  Trees,
  Camera,
  Sun,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Property } from "./data";

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  Parking: <Car className="w-3.5 h-3.5" />,
  Generator: <Zap className="w-3.5 h-3.5" />,
  Security: <Shield className="w-3.5 h-3.5" />,
  Garden: <Trees className="w-3.5 h-3.5" />,
  CCTV: <Camera className="w-3.5 h-3.5" />,
  Solar: <Sun className="w-3.5 h-3.5" />,
  Gym: <Coffee className="w-3.5 h-3.5" />,
  Pool: <Coffee className="w-3.5 h-3.5" />,
};
function getIcon(feature: string) {
  for (const key in FEATURE_ICONS)
    if (feature.toLowerCase().includes(key.toLowerCase()))
      return FEATURE_ICONS[key];
  return <Shield className="w-3.5 h-3.5" />;
}

interface Props {
  property: Property;
  onClose: () => void;
  onSchedule: () => void;
}

export function PropertyDetailModal({ property, onClose, onSchedule }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const imgs = property.images;

  // Collage: show up to 5 images in a clean grid
  // Layout: 1 main large + up to 4 thumbs on the right (2×2)
  // If > 5 total, last thumb shows "+N"
  const SHOW = 5;
  const mainImg = imgs[0];
  const thumbs = imgs.slice(1, SHOW); // up to 4 thumbs
  const remaining = imgs.length - SHOW; // extras beyond shown

  return (
    <>
      {/* ── BACKDROP ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        style={{ background: "rgba(8,17,33,0.82)", backdropFilter: "blur(10px)" }}
        onClick={onClose}
      >
        {/* ── PANEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl my-6"
          style={{ maxHeight: "92vh", overflowY: "auto" }}
        >
          {/* ══════════════════════════════════════
              PHOTO COLLAGE
          ══════════════════════════════════════ */}
          <div className="relative select-none">
            {/* Close button — always on top of collage, always visible */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-[#0A1628]/75 text-white flex items-center justify-center hover:bg-[#0A1628] transition-colors shadow-lg"
              style={{ backdropFilter: "blur(4px)" }}
            >
              <X className="w-4 h-4" />
            </button>

            {imgs.length === 1 ? (
              /* ── Single ── */
              <div
                className="h-64 bg-gray-200 cursor-zoom-in overflow-hidden flex items-center justify-center"
                onClick={() => setLightbox(0)}
              >
                <SafeImg
                  src={imgs[0]}
                  alt={property.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ) : (
              /* ── Collage: main + thumbs ── */
              <div className="flex gap-1 h-64 bg-gray-200">
                {/* Main image — ~60% width */}
                <div
                  className="relative flex-[3] overflow-hidden cursor-zoom-in bg-gray-200"
                  onClick={() => setLightbox(0)}
                >
                  <SafeImg
                    src={mainImg}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                    hoverScale
                  />
                </div>

                {/* Thumbnails — right column, equal rows */}
                {thumbs.length > 0 && (
                  <div
                    className="flex-[2] grid gap-1"
                    style={{
                      gridTemplateRows: `repeat(${Math.min(thumbs.length, 4)}, 1fr)`,
                    }}
                  >
                    {thumbs.map((src, i) => {
                      const isLast = i === thumbs.length - 1;
                      const showPlus = isLast && remaining > 0;
                      return (
                        <div
                          key={i}
                          className="relative overflow-hidden cursor-zoom-in bg-gray-200"
                          onClick={() => setLightbox(i + 1)}
                        >
                          <SafeImg
                            src={src}
                            alt={`Photo ${i + 2}`}
                            className="w-full h-full object-cover transition-transform duration-500"
                            hoverScale
                          />
                          {showPlus && (
                            <div className="absolute inset-0 bg-[#0A1628]/60 flex flex-col items-center justify-center gap-0.5">
                              <span
                                className="text-white"
                                style={{
                                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                                  fontWeight: 800,
                                  fontSize: 22,
                                  lineHeight: 1,
                                }}
                              >
                                +{remaining}
                              </span>
                              <span
                                className="text-white/70 text-xs"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                              >
                                photos
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Type + Furnishing badges over collage */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              <span
                className="px-2.5 py-1 rounded-md text-xs text-[#0A1628] bg-[#D4A853]"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                {property.type}
              </span>
              <span
                className="px-2.5 py-1 rounded-md text-xs text-white bg-[#0A1628]/70 backdrop-blur-sm"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                }}
              >
                {property.furnishing}
              </span>
            </div>

            {/* Photo count pill bottom-right of collage */}
            <button
              onClick={() => setLightbox(0)}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1628]/65 backdrop-blur-sm hover:bg-[#0A1628]/85 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-[#D4A853]" />
              <span
                className="text-white text-xs"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                }}
              >
                {imgs.length} Photos
              </span>
            </button>
          </div>

          {/* ══════════════════════════════════════
              BODY
          ══════════════════════════════════════ */}
          <div className="p-6 sm:p-7">
            {/* ── HEADER: price, title, location ── */}
            <div className="mb-5 pb-5 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <p
                    className="text-[#D4A853] mb-1"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: 24,
                      lineHeight: 1,
                    }}
                  >
                    {property.priceLabel}
                  </p>
                  <h2
                    className="text-[#0A1628] leading-tight mb-2"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: 19,
                    }}
                  >
                    {property.title}
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4A853] flex-shrink-0" />
                    <span
                      className="text-gray-500 text-sm"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {property.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {property.beds > 0 && (
                  <StatPill icon={<Bed className="w-3.5 h-3.5" />} label={`${property.beds} Bedrooms`} />
                )}
                {property.baths > 0 && (
                  <StatPill icon={<Bath className="w-3.5 h-3.5" />} label={`${property.baths} Bathrooms`} />
                )}
                <StatPill
                  icon={<Square className="w-3.5 h-3.5" />}
                  label={`${property.area} ${property.areaUnit}`}
                />
              </div>
            </div>

            {/* ── TWO COLUMNS ── */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-6">
              {/* LEFT */}
              <div className="space-y-5">
                {/* Description */}
                <div>
                  <SLabel>Description</SLabel>
                  <p
                    className="text-gray-600 text-sm leading-[1.8]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {property.description}
                  </p>
                </div>

                {/* Features */}
                <div>
                  <SLabel>Amenities</SLabel>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F7FA] border border-gray-100 text-xs text-[#0A1628]"
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        <span className="text-[#D4A853]">{getIcon(f)}</span>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Map */}
                <div>
                  <SLabel>Location</SLabel>
                  <div className="rounded-xl overflow-hidden border border-gray-100 h-40">
                    <iframe
                      title="map"
                      src={`https://maps.google.com/maps?q=${property.lat},${property.lng}&z=15&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT sidebar */}
              <div className="space-y-3">
                {/* Agent */}
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="bg-[#0A1628] px-4 py-3">
                    <p
                      className="text-white/50 text-[10px] uppercase tracking-widest mb-2"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      Listed By
                    </p>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={property.agentImage}
                        alt={property.agentName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#D4A853] flex-shrink-0"
                      />
                      <div>
                        <p
                          className="text-white text-sm"
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 700,
                          }}
                        >
                          {property.agentName}
                        </p>
                        <p
                          className="text-white/50 text-xs"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Verified Agent
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <a
                      href={`tel:${property.agentPhone}`}
                      className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-200 text-[#0A1628] text-xs hover:border-[#0A1628] hover:bg-[#0A1628] hover:text-white transition-all"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {property.agentPhone}
                    </a>
                  </div>
                </div>

                {/* Quick info */}
                <div className="rounded-xl border border-gray-100 px-4 py-3 space-y-2.5">
                  <p
                    className="text-[10px] uppercase tracking-widest text-gray-400"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    Quick Info
                  </p>
                  {[
                    { k: "Type", v: property.type },
                    { k: "Furnishing", v: property.furnishing },
                    { k: "City", v: property.city },
                    { k: "Area", v: `${property.area} ${property.areaUnit}` },
                  ].map(({ k, v }) => (
                    <div key={k} className="flex items-center justify-between">
                      <span
                        className="text-gray-400 text-xs"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {k}
                      </span>
                      <span
                        className="text-[#0A1628] text-xs"
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    onClose();
                    onSchedule();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[#0A1628] text-sm transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: "#D4A853",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  Schedule a Visit
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            key="lb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95"
            onClick={() => setLightbox(null)}
          >
            {/* Close button — always top-right corner, independent of image content */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(null);
              }}
              className="fixed top-4 right-4 z-[80] w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors shadow-lg backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <SafeImg
                src={imgs[lightbox]}
                alt={`Photo ${lightbox + 1}`}
                className="w-full max-h-[85vh] object-contain rounded-xl"
              />
              {lightbox > 0 && (
                <button
                  onClick={() => setLightbox((n) => n! - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {lightbox < imgs.length - 1 && (
                <button
                  onClick={() => setLightbox((n) => n! + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imgs.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(i)}
                    className={`rounded-full transition-all ${
                      i === lightbox
                        ? "w-5 h-1.5 bg-[#D4A853]"
                        : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StatPill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F7FA] border border-gray-100"
    >
      <span className="text-[#D4A853]">{icon}</span>
      <span
        className="text-[#0A1628] text-xs"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] uppercase tracking-widest text-gray-400 mb-2"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
    >
      {children}
    </p>
  );
}

/* SafeImg — shows a grey placeholder with an image-broken icon if src fails to load.
   The parent container (and the modal's X button) remain fully visible regardless. */
function SafeImg({
  src,
  alt,
  className,
  hoverScale,
}: {
  src: string;
  alt: string;
  className?: string;
  hoverScale?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className={`w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-2 ${className ?? ""}`}>
        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 19.5h16.5a1.5 1.5 0 001.5-1.5v-13a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v13a1.5 1.5 0 001.5 1.5z" />
        </svg>
        <span className="text-gray-300 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
          Image unavailable
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      onMouseEnter={hoverScale ? (e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; } : undefined}
      onMouseLeave={hoverScale ? (e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; } : undefined}
      style={{ transition: hoverScale ? "transform 500ms ease" : undefined }}
    />
  );
}
