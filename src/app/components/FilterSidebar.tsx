import { useReducer, useEffect, useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { CITIES } from "./data";

export interface Filters {
  minPrice: number;
  maxPrice: number;
  city: string;
  beds: number | null;
  types: string[];
  furnishing: string | null;
}

interface FilterSidebarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  totalResults: number;
}

const PROPERTY_TYPES = ["House", "Apartment", "Plot", "Commercial"];
const FURNISHING_OPTIONS = ["Furnished", "Semi-Furnished", "Unfurnished"];
const BED_OPTIONS = [1, 2, 3, 4];

const PKR_MIN = 0;
const PKR_MAX = 200000000;

// ── useReducer ────────────────────────────────────────────
type FilterAction =
  | { type: "SET_PRICE"; min: number; max: number }
  | { type: "SET_CITY"; city: string }
  | { type: "SET_BEDS"; beds: number | null }
  | { type: "SET_TYPES"; types: string[] }
  | { type: "SET_FURNISHING"; furnishing: string | null }
  | { type: "CLEAR_ALL" };

interface LocalState {
  localMin: number;
  localMax: number;
}

function localReducer(state: LocalState, action: FilterAction): LocalState {
  switch (action.type) {
    case "SET_PRICE":
      return { ...state, localMin: action.min, localMax: action.max };
    case "CLEAR_ALL":
      return { localMin: PKR_MIN, localMax: PKR_MAX };
    default:
      return state;
  }
}

function formatPKR(v: number) {
  if (v >= 10000000) return `PKR ${(v / 10000000).toFixed(1)} Cr`;
  if (v >= 100000) return `PKR ${(v / 100000).toFixed(0)} Lakh`;
  return `PKR ${v.toLocaleString()}`;
}

export function FilterSidebar({ filters, onChange, totalResults }: FilterSidebarProps) {
  const [local, dispatchLocal] = useReducer(localReducer, {
    localMin: filters.minPrice,
    localMax: filters.maxPrice,
  });
  const [mobileOpen, setMobileOpen] = useReducer((v: boolean) => !v, false);

  useEffect(() => {
    dispatchLocal({ type: "SET_PRICE", min: filters.minPrice, max: filters.maxPrice });
  }, [filters.minPrice, filters.maxPrice]);

  const update = useCallback(
    (patch: Partial<Filters>) => onChange({ ...filters, ...patch }),
    [filters, onChange]
  );

  const toggleType = useCallback(
    (t: string) => {
      const types = filters.types.includes(t)
        ? filters.types.filter((x) => x !== t)
        : [...filters.types, t];
      update({ types });
    },
    [filters.types, update]
  );

  const clearAll = useCallback(() => {
    dispatchLocal({ type: "CLEAR_ALL" });
    onChange({
      minPrice: PKR_MIN,
      maxPrice: PKR_MAX,
      city: "All Cities",
      beds: null,
      types: [],
      furnishing: null,
    });
  }, [onChange]);

  const applyPrice = useCallback(
    () => update({ minPrice: local.localMin, maxPrice: local.localMax }),
    [local.localMin, local.localMax, update]
  );

  const SidebarContent = () => (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#D4A853]" />
          <span
            className="text-[#0A1628]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 15 }}
          >
            Filter Properties
          </span>
        </div>
        <button
          onClick={clearAll}
          className="text-xs text-[#D4A853] hover:text-[#B8893A] transition-colors"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <Section title="Price Range">
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-3">
            <span>{formatPKR(local.localMin)}</span>
            <span>{formatPKR(local.localMax)}</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Min Price</label>
              <input
                type="range"
                min={PKR_MIN}
                max={PKR_MAX}
                step={500000}
                value={local.localMin}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v <= local.localMax)
                    dispatchLocal({ type: "SET_PRICE", min: v, max: local.localMax });
                }}
                className="w-full accent-[#D4A853] h-1.5"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Max Price</label>
              <input
                type="range"
                min={PKR_MIN}
                max={PKR_MAX}
                step={500000}
                value={local.localMax}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v >= local.localMin)
                    dispatchLocal({ type: "SET_PRICE", min: local.localMin, max: v });
                }}
                className="w-full accent-[#D4A853] h-1.5"
              />
            </div>
          </div>
          <button
            onClick={applyPrice}
            className="mt-3 w-full py-1.5 rounded-lg text-xs text-[#0A1628] bg-[#D4A853]/20 hover:bg-[#D4A853]/40 transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
          >
            Apply Range
          </button>
        </div>
      </Section>

      {/* Location */}
      <Section title="Location">
        <select
          value={filters.city}
          onChange={(e) => update({ city: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-[#F5F7FA] text-sm text-[#0A1628] outline-none focus:border-[#D4A853] transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Section>

      {/* Beds */}
      <Section title="Number of Beds">
        <div className="flex flex-wrap gap-2">
          {BED_OPTIONS.map((b) => (
            <button
              key={b}
              onClick={() => update({ beds: filters.beds === b ? null : b })}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-all duration-200 ${
                filters.beds === b
                  ? "bg-[#D4A853] border-[#D4A853] text-[#0A1628]"
                  : "border-gray-200 text-gray-600 hover:border-[#D4A853] hover:text-[#D4A853]"
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
            >
              {b}
            </button>
          ))}
          <button
            onClick={() => update({ beds: filters.beds === 99 ? null : 99 })}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-all duration-200 ${
              filters.beds === 99
                ? "bg-[#D4A853] border-[#D4A853] text-[#0A1628]"
                : "border-gray-200 text-gray-600 hover:border-[#D4A853] hover:text-[#D4A853]"
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
          >
            4+
          </button>
        </div>
      </Section>

      {/* Property Type */}
      <Section title="Property Type">
        <div className="space-y-2">
          {PROPERTY_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => toggleType(t)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                  filters.types.includes(t)
                    ? "border-[#D4A853] bg-[#D4A853]"
                    : "border-gray-300 group-hover:border-[#D4A853]"
                }`}
              >
                {filters.types.includes(t) && (
                  <svg className="w-2.5 h-2.5 text-[#0A1628]" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                className="text-sm text-gray-700"
                style={{ fontFamily: "'Inter', sans-serif" }}
                onClick={() => toggleType(t)}
              >
                {t}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Furnishing */}
      <Section title="Furnishing">
        <div className="space-y-2">
          {FURNISHING_OPTIONS.map((f) => (
            <label key={f} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => update({ furnishing: filters.furnishing === f ? null : f })}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  filters.furnishing === f
                    ? "border-[#D4A853]"
                    : "border-gray-300 group-hover:border-[#D4A853]"
                }`}
              >
                {filters.furnishing === f && (
                  <div className="w-2 h-2 rounded-full bg-[#D4A853]" />
                )}
              </div>
              <span
                className="text-sm text-gray-700"
                style={{ fontFamily: "'Inter', sans-serif" }}
                onClick={() => update({ furnishing: filters.furnishing === f ? null : f })}
              >
                {f}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Apply Button */}
      <button
        className="w-full py-3 rounded-lg text-[#0A1628] mt-2 transition-all hover:brightness-110 active:scale-[0.98]"
        style={{
          background: "#D4A853",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
        }}
      >
        Apply Filters
        {totalResults > 0 && (
          <span className="ml-2 bg-[#0A1628] text-white text-xs px-2 py-0.5 rounded-full">
            {totalResults}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-20 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setMobileOpen()}
          className="flex items-center gap-2 px-6 py-3 rounded-full shadow-xl text-[#0A1628]"
          style={{
            background: "#D4A853",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen()}
          />
          <div className="relative ml-auto w-80 bg-white h-full overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span
                className="text-[#0A1628]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                Filters
              </span>
              <button onClick={() => setMobileOpen()}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4
        className="text-xs uppercase tracking-wider text-gray-400 mb-3"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
      >
        {title}
      </h4>
      {children}
      <div className="mt-4 border-b border-gray-100" />
    </div>
  );
}
