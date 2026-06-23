import { memo } from "react";
import { MapPin, Bed, Bath, Square, Eye } from "lucide-react";
import { Property } from "../../data/data";

interface PropertyCardProps {
  property: Property;
  onViewDetails: () => void;
  onSchedule: () => void;
}

function PropertyCardComponent({
  property,
  onViewDetails,
  onSchedule,
}: PropertyCardProps) {
  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
      data-aos="fade-up"
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-gray-100 h-52"
        onClick={onViewDetails}
      >
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2.5 py-1 rounded-lg text-xs text-[#0A1628] bg-[#D4A853]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
          >
            {property.type}
          </span>
        </div>
        {/* Furnishing badge */}
        <div className="absolute top-3 right-3">
          <span
            className="px-2.5 py-1 rounded-lg text-xs bg-[#0A1628]/75 text-white backdrop-blur-sm"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
          >
            {property.furnishing}
          </span>
        </div>
        {/* Photo count */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
            <Eye className="w-3 h-3 text-white" />
            <span
              className="text-white text-xs"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {property.images.length} photos
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div
          className="text-[#D4A853] mb-1"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          {property.priceLabel}
        </div>

        {/* Title */}
        <h3
          className="text-[#0A1628] mb-2 leading-snug"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#D4A853] flex-shrink-0" />
          <span
            className="text-gray-500 text-xs"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {property.location}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          {property.beds > 0 && (
            <Stat icon={<Bed className="w-3.5 h-3.5" />} label={`${property.beds} Beds`} />
          )}
          {property.baths > 0 && (
            <Stat icon={<Bath className="w-3.5 h-3.5" />} label={`${property.baths} Baths`} />
          )}
          <Stat
            icon={<Square className="w-3.5 h-3.5" />}
            label={`${property.area} ${property.areaUnit}`}
          />
        </div>

        {/* Short Description */}
        <p
          className="text-gray-500 text-sm mb-4 leading-relaxed"
          style={{
            fontFamily: "'Inter', sans-serif",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {property.shortDescription}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onViewDetails}
            className="view-details-btn flex-1 py-2.5 rounded-lg border-2 text-sm transition-all duration-200 flex items-center justify-center gap-1.5"
            style={{
              borderColor: "#0A1628",
              color: "#0A1628",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              transition: "background 0.18s, color 0.18s",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              btn.style.background = "#0A1628";
              btn.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget;
              btn.style.background = "transparent";
              btn.style.color = "#0A1628";
            }}
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </button>
          <button
            onClick={onSchedule}
            className="flex-1 py-2.5 rounded-lg text-sm text-[#0A1628] transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: "#D4A853",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            Schedule Visit
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1 text-gray-500">
      <span className="text-gray-400">{icon}</span>
      <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

export const PropertyCard = memo(PropertyCardComponent);
