import { useState, useCallback } from "react";
import { Search, Building2, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { PROPERTIES, Property } from "../data/data";
import { FilterSidebar, Filters } from "../components/property/FilterSidebar";
import { PropertyCard } from "../components/property/PropertyCard";
import { PropertyDetailModal } from "../components/modals/PropertyDetailModal";
import { ScheduleVisitModal } from "../components/modals/ScheduleVisitModal";
import { fetchProperties } from "../api/properties";

const PER_PAGE = 6;

interface ListingPageProps {
  userName: string | null;
  onLoginRequired: (property: Property) => void;
}

function ListingPageComponent({ userName, onLoginRequired }: ListingPageProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 200000000,
    city: "All Cities",
    beds: null,
    types: [],
    furnishing: null,
  });
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [scheduleProperty, setScheduleProperty] = useState<Property | null>(null);
  const [page, setPage] = useState(1);

  const { data: allProperties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });

  const filtered = (allProperties || PROPERTIES).filter((p: Property) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !p.title.toLowerCase().includes(q) &&
        !p.location.toLowerCase().includes(q) &&
        !p.city.toLowerCase().includes(q)
      )
        return false;
    }
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    if (filters.city !== "All Cities" && p.city !== filters.city) return false;
    if (filters.beds !== null) {
      if (filters.beds === 99) {
        if (p.beds < 4) return false;
      } else {
        if (p.beds !== filters.beds) return false;
      }
    }
    if (filters.types.length > 0 && !filters.types.includes(p.type)) return false;
    if (filters.furnishing && p.furnishing !== filters.furnishing) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleViewDetails = useCallback((property: Property) => {
    setDetailProperty(property);
  }, []);

  const handleSchedule = useCallback((property: Property) => {
    if (!userName) {
      onLoginRequired(property);
      return;
    }
    setScheduleProperty(property);
  }, [userName, onLoginRequired]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Skeleton cards for loading state
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse"
      >
        <div className="h-52 bg-gray-200" />
        <div className="p-4 space-y-3">
          <div className="h-6 w-28 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-3 w-36 bg-gray-200 rounded" />
          <div className="flex gap-3">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
          <div className="h-8 w-full bg-gray-200 rounded-lg" />
          <div className="flex gap-2">
            <div className="h-9 flex-1 bg-gray-200 rounded-lg" />
            <div className="h-9 flex-1 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Hero */}
      <div
        className="relative bg-[#0A1628] pt-24 pb-16"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=600&fit=crop&auto=format)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#0A1628]/85" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A853]/20 border border-[#D4A853]/30 mb-6">
              <Building2 className="w-3.5 h-3.5 text-[#D4A853]" />
              <span
                className="text-[#D4A853] text-xs"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
              >
                Pakistan's Premier Property Platform
              </span>
            </div>
            <h1
              className="text-white mb-4"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                lineHeight: 1.1,
              }}
            >
              Find Your Perfect
              <br />
              <span className="text-[#D4A853]">Property</span> in Pakistan
            </h1>
            <p
              className="text-white/70 mb-8 max-w-xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 16 }}
            >
              Discover thousands of verified properties across Lahore, Karachi, Islamabad and beyond.
            </p>

            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-white rounded-2xl p-2 shadow-2xl max-w-2xl mx-auto">
              <MapPin className="w-5 h-5 text-[#D4A853] ml-2 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by location, city, or property name..."
                className="flex-1 outline-none text-[#0A1628] placeholder-gray-400 bg-transparent"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 15 }}
              />
              <button
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-[#0A1628] transition-all hover:brightness-110"
                style={{
                  background: "#D4A853",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 mt-8">
              {[
                { value: "12,000+", label: "Properties Listed" },
                { value: "47", label: "Cities Covered" },
                { value: "8,500+", label: "Happy Families" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="text-[#D4A853]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 22 }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-white/60 text-xs mt-0.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <div data-aos="fade-right">
            <FilterSidebar
              filters={filters}
              onChange={(f) => { setFilters(f); setPage(1); }}
              totalResults={filtered.length}
            />
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2
                  className="text-[#0A1628]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 18 }}
                >
                  {isLoading
                    ? "Loading properties..."
                    : filtered.length > 0
                      ? `Showing ${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length} properties`
                      : "No properties found"}
                </h2>
                {search && (
                  <p className="text-gray-500 text-sm mt-0.5">
                    Results for &ldquo;{search}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Loading Skeletons */}
            {isLoading && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {renderSkeletons()}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="w-20 h-20 rounded-2xl bg-[#F5F7FA] flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-10 h-10 text-gray-300" />
                </div>
                <h3
                  className="text-[#0A1628] mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 18 }}
                >
                  No Properties Available
                </h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  Try adjusting your filters or search query to find more properties.
                </p>
              </div>
            )}

            {/* Cards Grid */}
            {!isLoading && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {paginated.map((property, i) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.07 }}
                  >
                    <PropertyCard
                      property={property}
                      onViewDetails={() => handleViewDetails(property)}
                      onSchedule={() => handleSchedule(property)}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#D4A853] hover:text-[#D4A853] transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-lg text-sm transition-all ${
                      page === p
                        ? "text-[#0A1628]"
                        : "border border-gray-200 text-gray-600 hover:border-[#D4A853] hover:text-[#D4A853]"
                    }`}
                    style={{
                      background: page === p ? "#D4A853" : undefined,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#D4A853] hover:text-[#D4A853] transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Detail Modal */}
      {detailProperty && (
        <PropertyDetailModal
          property={detailProperty}
          onClose={() => setDetailProperty(null)}
          onSchedule={() => handleSchedule(detailProperty)}
        />
      )}

      {/* Schedule Visit Modal */}
      {scheduleProperty && (
        <ScheduleVisitModal
          propertyTitle={scheduleProperty.title}
          propertyLocation={scheduleProperty.location}
          userName={userName}
          onClose={() => setScheduleProperty(null)}
        />
      )}
    </div>
  );
}

export { ListingPageComponent as ListingPage };
