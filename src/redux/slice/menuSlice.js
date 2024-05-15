import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menu: [], //key dùng để bốc tách khi useSelector
  menuActive: 0,
};
export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    //tên function dùng để dispatch về
    updateMenu: (state, action) => {
      state.menu = action.payload;
    },
    updateMenuActive: (state, action) => {
      state.menuActive = action.payload;
    },
  },
});

export const { updateMenu, updateMenuActive } = menuSlice.actions; //export tên function dùng để dispatch

export default menuSlice.reducer; //export tên reducer để tạo store
