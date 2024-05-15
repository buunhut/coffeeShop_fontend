import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./sellpage.scss";
import {
  updateListTable,
  updateTableSelected,
} from "../redux/slice/tableSlice";
import { updateUser } from "../redux/slice/userSlice";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateMenu, updateMenuActive } from "../redux/slice/menuSlice";
import { updateListBill } from "../redux/slice/billSlice";
import ProductItem, { addressURL } from "./components/product/ProductItem";
import ProductItemSettingMode from "./components/product/ProductItemSettingMode";
import {
  updateIsLoading,
  updateSettingMode,
} from "../redux/slice/settingSlice";
import CategoryItem from "./components/category/CategoryItem";
import CategoryItemSettingMode from "./components/category/CategoryItemSettingMode";
import TableItemSettingMode from "./components/table/TableItemSettingMode";
import TableItem from "./components/table/TableItem";
import NavigateButton from "./components/usually/NavigateButton";

export const capitalizeFirstLetter = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

export const truncateString = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str; // Trả về chuỗi ban đầu nếu độ dài không vượt quá giới hạn
  } else {
    return str.substring(0, maxLength - 3) + "..."; // Trả về chuỗi cắt ngắn và thêm dấu '...'
  }
};

//đọc text
export const speak = (text) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "vi-VN"; // Đặt ngôn ngữ là tiếng Việt
  synth.speak(utterance);
};

//save menu
export const saveMenu = (data) => {
  localStorage.setItem("menu", JSON.stringify(data));
};

export const API = process.env.REACT_APP_ADDRESS_URL;
console.log(API);

const SellPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { user, headers } = useSelector((state) => state.userSlice);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isLoading, settingMode } = useSelector((state) => state.settingSlice);

  // phần menu
  const { menu, menuActive } = useSelector((state) => state.menuSlice);
  // console.log(menu);

  //phần table
  const { listTable, tableSelected } = useSelector((state) => state.tableSlice);
  const countTable = listTable.length;

  //phần bill
  const { listBill } = useSelector((state) => state.billSlice);
  const listTableIsServing = listBill.filter(
    (item) => item.status === "serving"
  );

  const listTableIsPaid = listBill.filter((item) => item.status === "paid");
  const countTableServing = listTableIsServing?.length;
  const tableServingSelected = listTableIsServing.find(
    (item) => item.tableId === tableSelected?.tableId
  );

  const tableOrderDetail = tableServingSelected?.orderDetail;
  const tongTienTableSelected = tableOrderDetail?.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const tongTienTableIsServing = listTableIsServing?.reduce((total, table) => {
    const tableTotal =
      table.orderDetail?.reduce(
        (subtotal, item) => subtotal + item.quantity * item.price,
        0
      ) || 0;
    return total + tableTotal;
  }, 0);

  const tongTienTableIsPaid = listTableIsPaid?.reduce((total, table) => {
    const tableTotal =
      table.orderDetail?.reduce(
        (subtotal, item) => subtotal + item.quantity * item.price,
        0
      ) || 0;
    return total + tableTotal;
  }, 0);

  const handleTang = async (item) => {
    if (settingMode) {
      return;
    }
    const data = { orderId: item.orderId };
    const res = await axios({
      method: "post",
      url: `${API}/bill/increase-quantity`,
      data,
      headers,
    });
    if (res.data.statusCode === 200) {
      getListOrder();
    }
  };

  const handleGiam = async (item) => {
    if (settingMode) {
      return;
    }
    const { quantity } = item;
    if (quantity > 1) {
      const data = { orderId: item.orderId };
      dispatch(updateIsLoading(true));
      try {
        await axios({
          method: "post",
          url: `${API}/bill/decrease-quantity`,
          data,
          headers,
        });
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(updateIsLoading(false));
      }
    } else {
      handleXoa(item);
    }
    getListOrder();
  };

  const handleXoa = async (item) => {
    if (settingMode) {
      return;
    }
    const data = { orderId: item.orderId };
    const res = await axios({
      method: "delete",
      url: `${API}/bill/delete-order-item`,
      data,
      headers,
    });
    if (res.data.statusCode === 200) {
      getListOrder();
    }
  };

  const handleCancle = async (item) => {
    if (settingMode) {
      return;
    }

    const confirmPayment = window.confirm(
      `Bạn có chắc muốn xoá ${capitalizeFirstLetter(
        tableSelected.tableName
      )} ? `
    );
    if (confirmPayment) {
      const findBillDelete = listBill.find(
        (bill) => bill.tableId === item.tableId && bill.status === "serving"
      );
      if (findBillDelete) {
        const data = {
          billId: findBillDelete.billId,
        };
        const res = await axios({
          method: "delete",
          url: `${API}/bill/delete-bill`,
          data,
          headers,
        });
        if (res.data.statusCode === 200) {
          getListOrder();
        }
      }
    }
  };

  const handlePay = async (item, tongTienTableSelected) => {
    const { tableId, tableName } = item;

    const findItemPay = listTableIsServing.find(
      (item) => item.tableId === tableId && item.status === "serving"
    );
    const confirmPayment = window.confirm(
      `${capitalizeFirstLetter(
        tableName
      )} thanh toán ${tongTienTableSelected.toLocaleString()}đ ?`
    );
    if (confirmPayment) {
      dispatch(updateIsLoading(true)); // Set isLoading thành true khi bắt đầu gọi API
      const { staffName, staffId } = user;
      const data = {
        billId: findItemPay.billId,
        total: tongTienTableSelected,
        staffName,
        staffId,
      };
      try {
        const res = await axios({
          method: "post",
          url: `${API}/bill/pay-bill`,
          headers,
          data,
        });
        if (res.data.statusCode === 200) {
          getListOrder();
          getCategory();
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        // setIsLoading(false); // Set isLoading thành false sau khi nhận được phản hồi từ API
        dispatch(updateIsLoading(false));
      }
    } else {
      return;
    }
  };

  // chức năng kéo thả
  const [dragedItem, setDragedItem] = useState(null);
  const handleDragStart = (event) => {
    // Lấy dữ liệu từ phần tử kéo
    const data = JSON.parse(event.target.dataset.item);
    // console.log(data)
    // setDraggedItem(data);
    setDragedItem(data);
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDrop = (event) => {
    event.preventDefault();
    // Xử lý khi thả phần tử
    // handleOrder(dragedItem);
    setDragedItem(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(updateUser(null));
    dispatch(updateListTable([]));
    dispatch(updateMenu([]));
    dispatch(updateTableSelected(null));
    dispatch(updateSettingMode(false));
    dispatch(updateMenuActive(0));
    navigate("/dang-nhap");
  };

  //

  //chức năng setting
  const handleAddCategory = async () => {
    dispatch(updateIsLoading(true));
    try {
      const res = await axios({
        method: "post",
        url: `${API}/category`,
        headers,
      });
      if (res.data.statusCode === 200) {
        getCategory();
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(updateIsLoading(false));
    }
  };

  const handleAddMenuItem = async () => {
    const { categoryId } = menu[menuActive];
    const data = {
      categoryId,
    };
    dispatch(updateIsLoading(true));
    try {
      const res = await axios({
        method: "post",
        url: `${API}/menu-item`,
        headers,
        data,
      });
      if (res.data.statusCode === 200) {
        getCategory();
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(updateIsLoading(false));
    }
  };

  //gọi dữ liệu list order
  const getListOrder = async () => {
    try {
      dispatch(updateIsLoading(true));
      const res = await axios({
        method: "get",
        url: `${API}/bill`,
        headers,
      });
      if (res.data.statusCode === 200) {
        dispatch(updateListBill(res.data.content));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(updateIsLoading(false));
    }
  };

  //goi du lieu list category của quán
  const getCategory = async () => {
    const res = await axios({
      method: "get",
      url: `${API}/category`,
      headers: headers,
    });
    const { statusCode, content } = res.data;
    if (statusCode === 200) {
      const localMenu = JSON.parse(localStorage.getItem("menu"));
      if (localMenu && localMenu.length > 0) {
        const newMenu = [];
        const notInNewMenu = [];

        localMenu.map((localMenuItem) => {
          const find = content.find(
            (contentItem) => contentItem.categoryId === localMenuItem.categoryId
          );
          if (find) {
            newMenu.push(find);
          }
        });
        content.map((contentItem) => {
          const find = localMenu.find(
            (localMenuItem) =>
              contentItem.categoryId === localMenuItem.categoryId
          );
          if (!find) {
            notInNewMenu.push(contentItem);
          }
        });

        const combineMenu = [...notInNewMenu, ...newMenu];
        saveMenu(combineMenu);
        dispatch(updateMenu(combineMenu));
      } else {
        saveMenu(content);
        dispatch(updateMenu(content));
      }
    }
  };

  //gọi dữ liệu list table của quán
  const getTable = async () => {
    const res = await axios({
      method: "get",
      url: `${API}/tables`,
      headers: headers,
    });
    const { statusCode } = res.data;
    if (statusCode === 200) {
      dispatch(updateListTable(res.data.content));
    }
  };

  const checkRole = async (headers) => {
    dispatch(updateIsLoading(true));
    try {
      const res = await axios({
        method: "post",
        url: `${API}/shops/check-role`,
        headers,
      });
      const { statusCode, content } = res.data;
      if (statusCode !== 200) {
        navigate("/dang-nhap");
      } else {
        if (content[0] === "admin") {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(updateIsLoading(false));
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch(updateUser(user));
      headers = { token: user?.token };
      checkRole(headers);
      getCategory();
      getTable();
      getListOrder();
    } else {
      navigate("/dang-nhap");
    }
  }, []);

  if (user) {
    return (
      <div id="seller">
        {/* phần menu */}
        <div className="menu">
          <div className="menuTitle">
            {isAdmin && (
              <div>
                {settingMode ? (
                  <i
                    className="fa-solid fa-eye setting"
                    onClick={() => dispatch(updateSettingMode(!settingMode))}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-gear setting"
                    onClick={() => {
                      dispatch(updateSettingMode(!settingMode));
                      dispatch(updateTableSelected(null));
                    }}
                  ></i>
                )}
              </div>
            )}
            {/* {settingMode && <h3>Cài đặt</h3>} */}
            <div className="shopInfo">
              <i className="fa-solid fa-shop shopIcon"></i>
              <div>
                <h3 className="shopName">{user.shopInfo.shopName} </h3>
                {!isAdmin ? (
                  <p className="staffName">
                    {capitalizeFirstLetter(user?.staffName)}
                  </p>
                ) : (
                  <p className="staffName">
                    {capitalizeFirstLetter("chủ quán")}
                  </p>
                )}
              </div>
              <i
                className="fa-solid fa-arrow-right-from-bracket logout"
                onClick={handleLogout}
              ></i>
            </div>
            <div className="navigate">
              <NavigateButton text="Báo cáo" link="report" />
              {isAdmin && <NavigateButton text="Nhân viên" link="staff" />}
              <NavigateButton text="Hát nhạc" link="music" />
            </div>
          </div>
          <div className="slider">
            {settingMode ? (
              <div className="sliderContent">
                <div className="addButton" onClick={handleAddCategory}>
                  <button>
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>

                {menu?.map((item, index) => {
                  return (
                    <CategoryItemSettingMode
                      key={index}
                      index={index}
                      item={item}
                      getCategory={getCategory}
                      headers={headers}
                      menuActive={menuActive}
                      menu={menu}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="sliderContent">
                {menu.length === 0 && <h1>Menu</h1>}
                {menu?.map((item, index) => {
                  return (
                    <CategoryItem
                      key={index}
                      index={index}
                      item={item}
                      menuActive={menuActive}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <div className="container">
            <div className="content">
              {settingMode && menu[menuActive] && (
                <div className="addButton" onClick={handleAddMenuItem}>
                  <button>
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              )}
              {menu[menuActive]?.menuItem.map((item, index) => {
                return settingMode ? (
                  <div key={index}>
                    <ProductItemSettingMode
                      product={item}
                      getCategory={getCategory}
                      headers={headers}
                      menu={menu}
                    />
                  </div>
                ) : (
                  <div key={index}>
                    <ProductItem
                      product={item}
                      getListOrder={getListOrder}
                      headers={headers}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* phần table */}
        <div className="table">
          <div className="tableTitle">
            <div>
              <div className="money">
                <p>Tổng thu:</p>
                <p>{tongTienTableIsPaid.toLocaleString()}đ</p>
              </div>
              <div className="money">
                <p>Chưa thu:</p>{" "}
                <p>{tongTienTableIsServing.toLocaleString()}đ</p>
              </div>
            </div>
            {tableSelected ? (
              <h3>{capitalizeFirstLetter(tableSelected?.tableName)}</h3>
            ) : (
              <div>
                <div className="countTable">
                  <p>Còn trống:</p>{" "}
                  <p>{(countTable - countTableServing).toLocaleString()} bàn</p>
                </div>
                <div className="countTable">
                  <p>Đang phục vụ:</p>
                  <p>{countTableServing.toLocaleString()} bàn</p>
                </div>
              </div>
            )}
          </div>
          <div className="tableContent">
            <div className="slider">
              <div
                className="sliderContent"
                style={{
                  gridTemplateColumns: `repeat(${
                    listTable.length <= 10
                      ? settingMode
                        ? 10 + 1
                        : 10
                      : settingMode
                      ? Math.ceil((listTable.length + 1) / 2)
                      : Math.ceil(listTable.length / 2)
                  }, 1fr)`,
                }}
              >
                {settingMode ? (
                  <>
                    <TableItemSettingMode
                      listTable={listTable}
                      listBill={listBill}
                      headers={headers}
                      getTable={getTable}
                    />
                  </>
                ) : (
                  <>
                    {listTable.length === 0 && <h1>Table</h1>}
                    <TableItem
                      listTable={listTable}
                      listBill={listBill}
                      tableSelected={tableSelected}
                      getListOrder={getListOrder}
                      headers={headers}
                    />
                  </>
                )}
              </div>
            </div>

            {/* phần chi tiết bill */}
            {tableSelected ? (
              <div
                className="content"
                // vùng thả
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {tableOrderDetail && (
                  <>
                    {tongTienTableSelected > 0 && (
                      <div className="function">
                        <div>
                          <button
                            className="delete"
                            onClick={() => handleCancle(tableSelected)}
                          >
                            <i className="fa-regular fa-trash-can"></i>
                          </button>
                          <button
                            onClick={() =>
                              handlePay(tableSelected, tongTienTableSelected)
                            }
                          >
                            Thanh toán
                          </button>
                        </div>
                        <h3>
                          Tổng tiền: {tongTienTableSelected.toLocaleString()}
                        </h3>
                      </div>
                    )}
                    <div
                      //vùng kéo
                      draggable={true}
                    >
                      {tableOrderDetail?.map((item, index) => {
                        const thanhTien = item.quantity * item.price;
                        return (
                          <div className="item" key={index}>
                            <div className="tenSanPham">
                              <h4>{capitalizeFirstLetter(item.name)}</h4>
                              <span>
                                {item.price.toLocaleString()} x{" "}
                                {item.quantity.toLocaleString()}
                              </span>
                            </div>
                            <div className="tangGiamXoa">
                              <button
                                className="tang"
                                onClick={() => handleTang(item)}
                              >
                                <i className="fa-solid fa-plus"></i>
                              </button>
                              <button
                                className="giam"
                                onClick={() => handleGiam(item)}
                              >
                                <i className="fa-solid fa-minus"></i>
                              </button>
                              <button
                                className="xoa"
                                onClick={() => handleXoa(item)}
                              >
                                <i className="fa-regular fa-trash-can"></i>
                              </button>
                            </div>
                            <div>
                              <p>{thanhTien.toLocaleString()}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="nothing">
                <h1>
                  {settingMode
                    ? ""
                    : listTable.length > 0
                    ? "Chưa chọn bàn"
                    : ""}
                </h1>
              </div>
            )}
          </div>
        </div>
        {isLoading && (
          <div className="overlay">{/* <h1>Đang xử lý...</h1> */}</div>
        )}
      </div>
    );
  }
};

export default SellPage;
