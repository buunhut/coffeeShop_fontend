import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listBill: [], //key dùng để bốc tách khi useSelector
    tableOrderDetail: []
};
export const billSlice = createSlice({
    name: "bill",
    initialState,
    reducers: {
        //tên function dùng để dispatch về
        updateListBill: (state, action) => {
            state.listBill = action.payload
        },
        updateTableOrderDetaill: (state, action) => {
            state.tableOrderDetail = action.payload
        },

    },
});

export const { updateListBill, updateTableOrderDetaill } = billSlice.actions; //export tên function dùng để dispatch

export default billSlice.reducer; //export tên reducer để tạo store
