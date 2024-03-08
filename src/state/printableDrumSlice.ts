import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DrumSchema } from "src/components/ModelSettingsPanel/inputSchema";
import { defaultDrum } from "src/model/defaultDrum";

const initialState: DrumSchema = defaultDrum;

const printableDrumSlice = createSlice({
  name: "unit",
  initialState,
  reducers: {
    setPrintableDrum: (state, action: PayloadAction<DrumSchema>) => {
      state = action.payload;
    }
  },
});

export const { setPrintableDrum } = printableDrumSlice.actions;
export default printableDrumSlice.reducer;
