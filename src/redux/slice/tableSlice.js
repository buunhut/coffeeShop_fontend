import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tableSelected: null,
  listTable: [],
  listTableIsServing: [],
};
export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    updateListTable: (state, action) => {
      state.listTable = action.payload;
    },
    updateTableSelected: (state, action) => {
      state.tableSelected = action.payload;
    },
  },
});

export const { updateListTable, updateTableSelected } = tableSlice.actions; //export tên function dùng để dispatch

export default tableSlice.reducer; //export tên reducer để tạo store
