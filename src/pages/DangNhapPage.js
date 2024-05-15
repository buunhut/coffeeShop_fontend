import React, { useState } from "react";
import "./userpage.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/slice/userSlice";
import { API } from "./SellPage";

const DangNhap = () => {
  const [shop, setShop] = useState({
    shopPhone: "",
    shopPass: "",
  });
  const [alert, setAlert] = useState({
    shopPhone: "",
    shopPass: "",
  });

  const handleChangeInput = (e) => {
    const { id, value } = e.target;
    if (value === "") {
      setShop((prevShop) => ({
        ...prevShop,
        [id]: value,
      }));
      setAlert((prevAlert) => ({
        ...prevAlert,
        [id]: "Vui lòng nhập dữ liệu",
      }));
    } else {
      setShop((prevShop) => ({
        ...prevShop,
        [id]: value,
      }));
      setAlert((prevAlert) => ({
        ...prevAlert,
        [id]: "",
      }));
    }
  };

  const saveLocal = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handlePhoneInputChange = async (e) => {
    const phoneRegex = /^[0-9]*$/; // Regex to allow only numeric input
    const inputValue = e.target.value;
    if (phoneRegex.test(inputValue) || inputValue === "") {
      setShop((prevShop) => ({
        ...prevShop,
        shopPhone: inputValue,
      }));
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDangNhap = async () => {
    let isValid = true;
    for (const key in shop) {
      if (shop[key].trim() === "") {
        isValid = false;
        setAlert((prevAlert) => ({
          ...prevAlert,
          [key]: "Vui lòng nhập dữ liệu", // Dynamically update alert based on shop key
        }));
      }
    }
    if (isValid && alert.shopPhone === "") {
      const res = await axios({
        method: "post",
        url: `${API}/shops/sign-in`,
        data: shop,
      });

      // console.log(res.data);
      if (res.data.statusCode === 200) {
        setShop({
          shopPhone: "",
          shopPass: "",
        });
        saveLocal("user", res.data.content);
        dispatch(updateUser(res.data.content));
        navigate("/admin");
      }
    }
  };
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="content">
      <div className="lock">
        <i className="fa-solid fa-lock"></i>
      </div>
      <h1>Đăng Nhập Hệ Thống</h1>
      <div className="form">
        <form action="">
          <div className="inputItem">
            <i className="fa-solid fa-phone"></i>
            <input
              type="text"
              placeholder="Số điện thoại"
              id="shopPhone"
              value={shop.shopPhone}
              onChange={handlePhoneInputChange}
            />
          </div>
          <p className="alert">{alert.shopPhone}</p>
          <div className="inputItem">
            <i className="fa-solid fa-lock"></i>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Mật khẩu"
              id="shopPass"
              value={shop.shopPass}
              onChange={handleChangeInput}
            />
            {showPass ? (
              <i
                className="fa-regular fa-eye-slash showPass"
                onClick={() => setShowPass(!showPass)}
              ></i>
            ) : (
              <i
                className="fa-regular fa-eye showPass"
                onClick={() => setShowPass(!showPass)}
              ></i>
            )}
          </div>
          <p className="alert">{alert.shopPass}</p>
          <button type="button" onClick={handleDangNhap}>
            Đăng nhập
          </button>
          <span
            className="navigation"
            onClick={() => {
              navigate("/dang-ky");
            }}
          >
            Chưa có tài khoản, đăng ký ngay
          </span>
        </form>
        <p>
          Hotline: <a href="tel:0909240886">0909240886</a>{" "}
        </p>
      </div>
    </div>
  );
};

export default DangNhap;
