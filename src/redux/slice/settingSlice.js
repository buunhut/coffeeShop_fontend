import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settingMode: false,
  isLoading: false,
};
export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    //tên function dùng để dispatch về
    updateSettingMode: (state, action) => {
      state.settingMode = action.payload;
    },
    updateIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { updateSettingMode, updateIsLoading } = settingSlice.actions; //export tên function dùng để dispatch

export default settingSlice.reducer; //export tên reducer để tạo store
