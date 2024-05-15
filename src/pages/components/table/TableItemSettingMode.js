import React, { useState } from "react";
import { capitalizeFirstLetter, API, speak } from "../../SellPage";
import { updateTableSelected } from "../../../redux/slice/tableSlice";
import { useDispatch } from "react-redux";
import { updateIsLoading } from "../../../redux/slice/settingSlice";
import axios from "axios";
import moment from "moment";

const TableItemSettingMode = ({
  listTable,
  headers,
  getTable,
  tableSelected,
  listBill,
}) => {
  const dispatch = useDispatch();
  const handleAddTable = async () => {
    dispatch(updateIsLoading(true));
    try {
      const res = await axios({
        method: "post",
        url: `${API}/tables`,
        headers,
      });
      if (res.data.statusCode === 200) {
        getTable();
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(updateIsLoading(false));
    }
  };
  const handleDeleteTableName = async (item) => {
    const confirmPayment = window.confirm(
      `Bạn có chắc muốn xoá ${capitalizeFirstLetter(item.tableName)} ?`
    );
    if (!confirmPayment) {
      return;
    }

    dispatch(updateIsLoading(true));
    try {
      const { tableId } = item;
      const data = { tableId };
      const res = await axios({
        method: "delete",
        url: `${API}/tables`,
        data,
        headers,
      });
      if (res.data.statusCode === 200) {
        getTable();
        dispatch(updateTableSelected(null));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(updateIsLoading(false));
    }
  };
  const [tableValue, setTableValue] = useState({});
  const editTableName = async (e, tableId) => {
    const data = {
      tableId,
      tableName: e.target.value,
    };
    const res = await axios({
      method: "put",
      url: `${API}/tables`,
      data,
      headers,
    });
    if (res.data.statusCode === 200) {
      getTable();
      setTableValue({});
    }
  };

  return (
    <>
      <div className="sliderItemWrap">
        <div className="addButton" onClick={handleAddTable}>
          <button>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
      {listTable.map((item, index) => {
        const { tableId, tableName } = item;
        const tableServing = listBill?.find(
          (table) => table.tableId === tableId && table.status === "serving"
        );
        let total = 0;
        if (tableServing) {
          const { orderDetail } = tableServing;
          orderDetail?.map((item) => (total += item.quantity * item.price));
        }
        return (
          <div className="sliderItemWrap" key={index}>
            <div
              className="sliderItem"
              style={{
                borderColor: tableId === tableSelected?.tableId ? "red" : "",
                background: tableServing ? "orange" : "",
              }}
            >
              {tableServing ? (
                <>
                  <h4 style={{ color: "white" }}>
                    {capitalizeFirstLetter(tableName)}
                  </h4>

                  <span style={{ color: "white", fontSize: 12 }}>
                    {moment(tableServing?.inTime).format("HH:mm")}
                  </span>
                  <span style={{ color: "white", fontSize: 12 }}>
                    {capitalizeFirstLetter("đang phục vụ")}
                  </span>
                </>
              ) : (
                <>
                  <input
                    onChange={(e) => {
                      const { value } = e.target;
                      setTableValue((prev) => ({
                        ...prev,
                        [tableId]: value,
                      }));
                    }}
                    onBlur={(e) => editTableName(e, tableId)}
                    value={
                      tableValue[tableId] !== undefined
                        ? tableValue[tableId]
                        : capitalizeFirstLetter(tableName)
                    }
                  />
                  <i
                    className="fa-solid fa-trash-can deleteTableName"
                    onClick={() => handleDeleteTableName(item)}
                  ></i>
                  <h5>{capitalizeFirstLetter("trống")}</h5>
                </>
              )}
              {total > 0 && (
                <h5 style={{ color: "white" }}>{total.toLocaleString()}đ</h5>
              )}
            </div>
          </div>
        );
      })}{" "}
    </>
  );
};

export default TableItemSettingMode;
