import { createSlice } from "@reduxjs/toolkit";
interface UnitSlice {
  unit: "metric" | "imperial";
}

const initialState: UnitSlice = {
  unit: "metric",
};

const unitSlice = createSlice({
  name: "unit",
  initialState,
  reducers: {
    setMetric: (state) => {
      state.unit = "metric";
    },
    setImperial: (state) => {      
      state.unit = "imperial";
    },
  },
});

export const { setMetric, setImperial } = unitSlice.actions;
export default unitSlice.reducer;
