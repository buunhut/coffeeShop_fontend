import React, { useEffect, useState } from "react";
import "./staffpage.scss";
import NavigateButton from "./components/usually/NavigateButton";
import axios from "axios";
import { addressURL } from "./components/product/ProductItem";
import { useDispatch, useSelector } from "react-redux";
import { updateIsLoading } from "../redux/slice/settingSlice";
import { updateUser } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { API, capitalizeFirstLetter } from "./SellPage";

const StaffPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { headers, user } = useSelector((state) => state.userSlice);
  //check quyền
  const [isAdmin, setIsAdmin] = useState(false);

  const [listNhanVien, setListNhanVien] = useState([]);
  const [nhanVien, setNhanVien] = useState(null);
  const [showPass, setShowPass] = useState(null);
  // console.log(nhanVien);

  const handleAddStafe = () => {
    addStaff();
  };

  const handleChangeInput = (e) => {
    const { className, value } = e.target;
    setNhanVien((prev) => ({
      ...prev,
      [className]: value,
    }));
  };

  const handleUpdateNhanVien = () => {
    setNhanVien(null);
    updateStaff(nhanVien);
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

  const addStaff = async () => {
    dispatch(updateIsLoading(true));
    try {
      const res = await axios({
        method: "post",
        url: `${API}/staff`,
        headers,
      });
      console.log(res);
      if (res.data.statusCode === 200) {
        getStaff();
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(updateIsLoading(false));
    }
  };

  const updateStaff = async (data) => {
    dispatch(updateIsLoading(true));
    try {
      const res = await axios({
        method: "put",
        url: `${API}/staff`,
        headers,
        data,
      });
      console.log(res.data);
      if (res.data.statusCode === 200) {
        getStaff();
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(updateIsLoading(false));
    }
  };
  const deleteStaff = async (data) => {
    dispatch(updateIsLoading(true));
    try {
      const res = await axios({
        method: "delete",
        url: `${API}/staff`,
        headers,
        data,
      });
      if (res.data.statusCode === 200) {
        getStaff();
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(updateIsLoading(false));
    }
  };

  const handleDeleteStafe = (item) => {
    const { staffId } = item;
    const data = { staffId };
    deleteStaff(data);
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
      if (statusCode !== 200 || content[0] !== "admin") {
        navigate("/dang-nhap");
      } else {
        setIsAdmin(true);
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
      getStaff();
    } else {
      navigate("/dang-nhap");
    }
  }, []);

  return (
    <div id="nhanVien">
      <div className="nhanVienTitle">
        <p className="nhanVien">
          Nhân viên{" "}
          <button className="addStaff" onClick={handleAddStafe}>
            <i className="fa-solid fa-user-plus"></i>
          </button>
        </p>

        <NavigateButton text="Quay về" link="/admin" />
      </div>
      <div className="nhanVienContent">
        <table>
          <thead>
            <tr>
              <th className="staffNo">STT</th>
              <th>Tên nhân viên</th>
              <th className="staffPhone">Số điện thoại</th>
              <th className="staffPass">Mật khẩu</th>
              <th>Địa chỉ</th>
              <th className="staffPosition">Chức vụ</th>
              {/* <th>Ngày vào</th> */}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {listNhanVien?.map((item, index) => {
              const {
                staffName,
                staffPhone,
                staffPass,
                staffAddress,
                staffPosition,
                staffImage,
                staffDateStart,
              } = item;

              return (
                <tr key={index}>
                  <td className="tdRight">{index + 1}</td>
                  <td className="tdLeft">
                    <input
                      className="staffName"
                      placeholder="Tên nhân viên"
                      type="text"
                      value={
                        nhanVien && nhanVien.staffId === item.staffId
                          ? nhanVien.staffName === null
                            ? ""
                            : capitalizeFirstLetter(nhanVien.staffName)
                          : staffName === null
                          ? ""
                          : capitalizeFirstLetter(staffName)
                      }
                      onClick={() => {
                        setNhanVien(item);
                      }}
                      onChange={handleChangeInput}
                      onBlur={handleUpdateNhanVien}
                    />
                  </td>
                  <td className="tdLeft">
                    <input
                      className="staffPhone"
                      placeholder="Số điện thoại"
                      type="text"
                      value={
                        nhanVien && nhanVien.staffId === item.staffId
                          ? nhanVien.staffPhone === null
                            ? ""
                            : nhanVien.staffPhone
                          : staffPhone === null
                          ? ""
                          : staffPhone
                      }
                      onClick={() => {
                        setNhanVien(item);
                      }}
                      onChange={handleChangeInput}
                      onBlur={handleUpdateNhanVien}
                    />
                  </td>
                  <td className="tdLeft">
                    <input
                      className="staffPass"
                      placeholder="Mật khẩu"
                      type={
                        showPass?.staffId === item.staffId ? "text" : "password"
                      }
                      value={
                        nhanVien && nhanVien.staffId === item.staffId
                          ? nhanVien.staffPass === null
                            ? ""
                            : nhanVien.staffPass
                          : staffPass === null
                          ? ""
                          : staffPass
                      }
                      onClick={() => {
                        setNhanVien(item);
                      }}
                      onChange={handleChangeInput}
                      onBlur={handleUpdateNhanVien}
                    />
                    {showPass?.staffId === item.staffId ? (
                      <i
                        className="fa-regular fa-eye-slash showPass"
                        onClick={() => setShowPass(null)}
                      ></i>
                    ) : (
                      <i
                        className="fa-regular fa-eye showPass"
                        onClick={() => setShowPass({ staffId: item.staffId })}
                      ></i>
                    )}
                  </td>
                  <td className="tdLeft">
                    <input
                      className="staffAddress"
                      placeholder="Địa chỉ"
                      type="text"
                      value={
                        nhanVien && nhanVien.staffId === item.staffId
                          ? nhanVien.staffAddress === null
                            ? ""
                            : capitalizeFirstLetter(nhanVien.staffAddress)
                          : staffAddress === null
                          ? ""
                          : capitalizeFirstLetter(staffAddress)
                      }
                      onClick={() => {
                        setNhanVien(item);
                      }}
                      onChange={handleChangeInput}
                      onBlur={handleUpdateNhanVien}
                    />
                  </td>
                  <td className="tdLeft">
                    <input
                      className="staffPosition"
                      placeholder="Chức vụ"
                      type="text"
                      value={
                        nhanVien && nhanVien.staffId === item.staffId
                          ? nhanVien.staffPosition === null
                            ? ""
                            : capitalizeFirstLetter(nhanVien.staffPosition)
                          : staffPosition === null
                          ? ""
                          : capitalizeFirstLetter(staffPosition)
                      }
                      onClick={() => {
                        setNhanVien(item);
                      }}
                      onChange={handleChangeInput}
                      onBlur={handleUpdateNhanVien}
                    />
                  </td>
                  {/* <td className="tdLeft">
                    {moment(staffDateStart).format("HH:mm DD/MM/YYYY")}
                  </td> */}
                  <td className="tdCenter">
                    {item.staffId !== user.staffId && (
                      <i
                        className="fa-solid fa-trash-can deleteStaff"
                        onClick={() => handleDeleteStafe(item)}
                      ></i>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffPage;
