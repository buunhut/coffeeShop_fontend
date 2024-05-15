import React, { useEffect, useState } from "react";
import "./reportpage.scss";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/slice/userSlice";
import { useNavigate } from "react-router";
import axios from "axios";
import { addressURL } from "./components/product/ProductItem";
import { updateListBill } from "../redux/slice/billSlice";
import { capitalizeFirstLetter, API } from "./SellPage";
import NavigateButton from "./components/usually/NavigateButton";
import { updateIsLoading } from "../redux/slice/settingSlice";

const ReportPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [staffId, setStaffId] = useState("");

  let { headers } = useSelector((state) => state.userSlice);
  // console.log(headers);
  const { listBill } = useSelector((state) => state.billSlice);
  // console.log(listBill);

  const [listNhanVien, setListNhanVien] = useState([]);

  const handleChangeFromDate = (e) => {
    setFromDate(e.target.value);
    const data = { fromDate: e.target.value, toDate, staffId };
    // console.log(data);
    getBill(data, headers);
  };

  const handleChangeToDate = (e) => {
    setToDate(e.target.value);

    const data = { fromDate, toDate: e.target.value, staffId };
    getBill(data);
  };

  const handleChangeStaff = (e) => {
    const { value } = e.target;
    setStaffId(+value);
    const data = {
      fromDate,
      toDate,
      staffId: +value,
    };
    getBill(data);
  };

  const getBill = async (data) => {
    const res = await axios({
      method: "post",
      url: `${API}/bill/get-bill-by-date`,
      data,
      headers,
    });
    const { statusCode } = res.data;
    if (statusCode === 200) {
      dispatch(updateListBill(res.data.content));
    }
  };

  const getStaff = async () => {
    dispatch(updateIsLoading(false));

    try {
      const res = await axios({
        method: "get",
        url: `${API}/staff`,
        headers,
      });
      // console.log(res.data);
      const { statusCode, content } = res.data;
      if (statusCode === 200) {
        setListNhanVien(content);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(updateIsLoading(true));
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const today = new Date();
      const formatDate = moment(today).format("YYYY-MM-DD");
      setFromDate(formatDate);
      dispatch(updateUser(user));
      const data = { fromDate: formatDate, toDate };
      headers = { token: user?.token };
      getBill(data);
      getStaff();
    } else {
      navigate("/dang-nhap");
    }
  }, []);

  // Sử dụng reduce để tính tổng tiền của tất cả các hóa đơn
  const totalAmount = listBill.reduce((total, item) => {
    // Tính tổng tiền của mỗi hóa đơn
    const billTotal = item.orderDetail.reduce((subTotal, orderItem) => {
      return subTotal + orderItem.quantity * orderItem.price;
    }, 0);

    // Thêm tổng tiền của hóa đơn này vào tổng tổng của tất cả các hóa đơn
    return total + billTotal;
  }, 0);
  const totalPaid = listBill.reduce((total, item) => {
    if (item.status === "paid") {
      // Tính tổng tiền của mỗi hóa đơn
      const billTotal = item.orderDetail.reduce((subTotal, orderItem) => {
        return subTotal + orderItem.quantity * orderItem.price;
      }, 0);

      // Thêm tổng tiền của hóa đơn này vào tổng tổng của tất cả các hóa đơn
      return total + billTotal;
    }

    return total; // Trả về total nếu item.status không phải là "paid"
  }, 0);

  const totalServing = listBill.reduce((total, item) => {
    if (item.status === "serving") {
      // Tính tổng tiền của mỗi hóa đơn
      const billTotal = item.orderDetail.reduce((subTotal, orderItem) => {
        return subTotal + orderItem.quantity * orderItem.price;
      }, 0);

      // Thêm tổng tiền của hóa đơn này vào tổng tổng của tất cả các hóa đơn
      return total + billTotal;
    }

    return total; // Trả về total nếu item.status không phải là "serving"
  }, 0);

  const [detaileVeiw, setDetailVeiw] = useState(null);

  let tongTien = 0;
  let tongSoLuong = 0;

  // console.log(listBill);

  return (
    <div id="report">
      <div className="reportTitle">
        <p className="report">Report detail</p>
        <NavigateButton text="Quay về" link="/admin" />
      </div>
      <div className="form">
        <form>
          <div className="formContent">
            <div className="formWrap">
              <div className="formItem">
                <label htmlFor="formDate">From</label>
                <input
                  type="date"
                  id="formDate"
                  value={fromDate}
                  onChange={handleChangeFromDate}
                />
              </div>
              <div className="formItem">
                <label htmlFor="toDate">To</label>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={handleChangeToDate}
                />
              </div>
              <div className="formItem">
                <label htmlFor="toDate">Staff</label>
                <select name="" id="" onChange={handleChangeStaff}>
                  <option value={""}>All staff</option>
                  {listNhanVien?.map((item, index) => {
                    const { staffId, staffName } = item;
                    return (
                      <option value={staffId} key={index}>
                        {capitalizeFirstLetter(staffName)}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            {totalAmount > 0 && (
              <div className="reportInfo">
                <div className="reportInfoItem">
                  <p className="paid">Đã thu: </p>{" "}
                  <h5>{totalPaid.toLocaleString()}</h5>
                </div>
                <div className="reportInfoItem">
                  <p className="serving">Chưa thu: </p>
                  <h5 className="serving">{totalServing.toLocaleString()}</h5>
                </div>
                <div className="reportInfoItem">
                  <p className="total">Tổng cộng : </p>{" "}
                  <h5 className="total">{totalAmount.toLocaleString()}</h5>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
      {listBill.length > 0 ? (
        <div className="billContent">
          <table>
            <thead>
              <tr>
                <td>Phiếu ID</td>
                <td>Tên bàn</td>
                <td className="tdCenter">Giờ vào</td>
                <td className="tdCenter">Giờ ra</td>
                <td className="tdNumber">Tổng tiền</td>
                <td className="tdCenter">Trang thái</td>
                <td className="tdCenter">Nhân viên</td>
              </tr>
            </thead>
            <tbody>
              {listBill?.map((item, index) => {
                const {
                  timeIn,
                  timeOut,
                  billId,
                  status,
                  tables,
                  orderDetail,
                  staffName,
                } = item;
                let totalBill = orderDetail?.reduce((total, item) => {
                  return total + item.price * item.quantity;
                }, 0);

                return (
                  <tr key={index} onClick={() => setDetailVeiw(item)}>
                    <td>{billId}</td>
                    <td>{capitalizeFirstLetter(tables?.tableName)}</td>

                    <td className="tdCenter">
                      {moment(timeIn).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="tdCenter">
                      {timeOut
                        ? moment(timeOut).format("DD/MM/YYYY HH:mm ")
                        : null}
                    </td>
                    <td className="tdNumber">{totalBill.toLocaleString()}</td>
                    <td className="tdCenter">
                      {capitalizeFirstLetter(status)}
                    </td>
                    <td className="tdCenter">
                      {capitalizeFirstLetter(staffName)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="noData">
          <h1>Không có dữ liệu</h1>
        </div>
      )}

      {detaileVeiw && (
        <div className="detaileVeiw">
          <div
            className="detaileVeiwContent"
            style={{
              top: detaileVeiw ? "80px" : "-200px",
            }}
          >
            <div className="detaileVeiwWrap">
              <h3>Chi tiết</h3>
              <button onClick={() => setDetailVeiw(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="detailTitle">
                <div className="detailTitleItemLeft">
                  <p>Phiếu ID: {detaileVeiw.billId}</p>
                  <p>Bàn: {detaileVeiw.tables.tableName}</p>
                </div>
                <div className="detailTitleItemRight">
                  <p>
                    Giờ vào:{" "}
                    {moment(detaileVeiw.timeIn).format("DD/MM/YYYY HH:mm ")}
                  </p>
                  <p>
                    Giờ ra:{" "}
                    {detaileVeiw.timeOut &&
                      moment(detaileVeiw.timeOut).format("DD/MM/YYYY HH:mm ")}
                  </p>
                </div>
              </div>
              <div className="status">
                <p>Trạng thái: {capitalizeFirstLetter(detaileVeiw.status)}</p>
              </div>

              <table className="receipt">
                <thead>
                  <tr>
                    <td>Stt</td>
                    <td>Tên món</td>
                    <td>Đơn giá</td>

                    <td>Số lượng</td>
                    <td>Thành tiền</td>
                  </tr>
                </thead>
                {detaileVeiw?.orderDetail?.map((item, index) => {
                  tongTien += item?.price * item.quantity;
                  tongSoLuong += item.quantity;

                  return (
                    <tbody key={index}>
                      <tr>
                        <td className="tdNumber">{index + 1}</td>
                        <td>{item?.name}</td>
                        <td className="tdNumber">
                          {item?.price.toLocaleString()}
                        </td>
                        <td className="tdNumber">{item?.quantity}</td>
                        <td className="tdNumber">
                          {(item?.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
                <tfoot>
                  <tr>
                    <td colSpan={3}>Tổng tiền</td>
                    <td className="tdNumber">{tongSoLuong.toLocaleString()}</td>
                    <td className="tdNumber">{tongTien.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
