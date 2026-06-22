import { useMemo } from "react";
import { PROPERTIES } from "../app/components/data";
import type { Filters } from "../store/filterSlice";
import type { Property } from "../app/components/data";

const PER_PAGE = 6;

export function useProperties(filters: Filters, page: number, search: string) {
  return useMemo(() => {
    const filtered = PROPERTIES.filter((p: Property) => {
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

    return {
      properties: paginated,
      totalPages,
      totalCount: filtered.length,
    };
  }, [filters, page, search]);
}
