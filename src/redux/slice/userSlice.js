import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  headers: null,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
      state.headers = { token: action.payload?.token };
    },
  },
});

export const { updateUser, updateHeaders } = userSlice.actions; //export tên function dùng để dispatch

export default userSlice.reducer; //export tên reducer để tạo store
