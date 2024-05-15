import moment from "moment";
import React from "react";
import { capitalizeFirstLetter, API, speak } from "../../SellPage";
import { updateTableSelected } from "../../../redux/slice/tableSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const TableItem = ({
  listTable,
  listBill,
  tableSelected,
  getListOrder,
  headers,
}) => {
  const dispatch = useDispatch();
  const handleSelectTable = (item) => {
    const { tableName } = item;
    if (item.tableId === tableSelected?.tableId) {
      speak("bỏ chọn " + tableName);

      dispatch(updateTableSelected(null));
    } else {
      speak("chọn " + tableName);

      dispatch(updateTableSelected(item));
    }
  };

  const handleTransTable = async (event) => {
    const toTableId = +event.target.id;
    const fromTableId = tableSelected.tableId;
    if (toTableId !== fromTableId) {
      const data = {
        fromTableId,
        toTableId,
      };
      const res = await axios({
        method: "post",
        url: `${API}/bill/table-transform`,
        data,
        headers,
      });
      if (res.data.statusCode === 200) {
        getListOrder();
        const findTable = listTable.find(
          (item) => item.tableId === res.data.content
        );
        dispatch(updateTableSelected(findTable));
      }
    } else {
      console.log("vô lý nha");
    }
  };

  return (
    <>
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
              <h4 style={{ color: tableServing ? "white" : "" }}>
                {capitalizeFirstLetter(tableName)}
              </h4>

              {tableServing ? (
                <>
                  <span style={{ color: "white", fontSize: 12 }}>
                    {moment(tableServing?.inTime).format("HH:mm")}
                  </span>
                  <span style={{ color: "white", fontSize: 12 }}>
                    {capitalizeFirstLetter("đang phục vụ")}
                  </span>
                </>
              ) : (
                <h5>{capitalizeFirstLetter("trống")}</h5>
              )}
              {total > 0 && (
                <h5 style={{ color: "white" }}>{total.toLocaleString()}đ</h5>
              )}
            </div>
            <div
              className="overItem"
              onClick={() => handleSelectTable(item, index)}
              //vùng thả
              onDragOver={(event) => {
                event.preventDefault();
              }}
              onDrop={(event) => handleTransTable(event)}
              id={tableId}
            ></div>
          </div>
        );
      })}
    </>
  );
};

export default TableItem;
