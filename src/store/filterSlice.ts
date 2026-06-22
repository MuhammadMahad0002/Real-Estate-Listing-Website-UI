import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Filters {
  minPrice: number;
  maxPrice: number;
  city: string;
  beds: number | null;
  types: string[];
  furnishing: string | null;
}

interface FilterState {
  filters: Filters;
  page: number;
  search: string;
}

const initialState: FilterState = {
  filters: {
    minPrice: 0,
    maxPrice: 200000000,
    city: "All Cities",
    beds: null,
    types: [],
    furnishing: null,
  },
  page: 1,
  search: "",
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Filters>) {
      state.filters = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    clearFilters(state) {
      state.filters = initialState.filters;
      state.page = 1;
    },
  },
});

export const { setFilters, setPage, setSearch, clearFilters } = filterSlice.actions;
export default filterSlice.reducer;
