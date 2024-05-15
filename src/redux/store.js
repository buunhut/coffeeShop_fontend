import { configureStore } from "@reduxjs/toolkit";
import menuSlice from "./slice/menuSlice";
import tableSlice from "./slice/tableSlice";
import userSlice from "./slice/userSlice";
import billSlice from "./slice/billSlice";
import settingSlice from "./slice/settingSlice";
export const store = configureStore({
  reducer: {
    menuSlice, //đặt key của reducer trùng tên với slice
    tableSlice,
    userSlice,
    billSlice,
    settingSlice,
  },
});
