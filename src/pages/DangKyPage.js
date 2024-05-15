import React, { useEffect, useState } from "react";
import "./userpage.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "./SellPage";

const DangKy = () => {
  const navigate = useNavigate();
  const [shop, setShop] = useState({
    shopPhone: "",
    shopPass: "",
    shopName: "",
    shopAddress: "",
  });
  const [alert, setAlert] = useState({
    shopPhone: "",
    shopPass: "",
    shopName: "",
    shopAddress: "",
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

  const checkPhone = async (shopPhone) => {
    const res = await axios({
      method: "post",
      url: `${API}/shops/check-phone`,
      data: { shopPhone },
    });
    return res.data;
  };

  const signIn = async (data) => {
    const res = await axios({
      method: "post",
      url: `${API}/shops/sign-up`,
      data,
    });
    return res.data;
  };

  const handlePhoneInputChange = async (e) => {
    const phoneRegex = /^[0-9]*$/; // Regex to allow only numeric input
    const inputValue = e.target.value;
    if (phoneRegex.test(inputValue) || inputValue === "") {
      setShop((prevShop) => ({
        ...prevShop,
        shopPhone: inputValue,
      }));
      const check = await checkPhone(inputValue);
      const { statusCode } = check;
      if (statusCode === 209) {
        setAlert((prevAlert) => ({
          ...prevAlert,
          shopPhone: "Số điện thoại đã đăng ký",
        }));
      } else {
        setAlert((prevAlert) => ({
          ...prevAlert,
          shopPhone: "",
        }));
      }
    }
  };

  const handleDangKy = async () => {
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
      // console.log('Registration Data:', shop);
      const dangKy = await signIn(shop);
      const { statusCode } = dangKy;
      if (statusCode === 200) {
        setShop({
          shopPhone: "",
          shopPass: "",
          shopName: "",
          shopAddress: "",
        });
        // console.log("đăng ký thành công", dangKy);
        navigate("/dang-nhap");
      }
    }
  };

  const [showPass, setShowPass] = useState(false);

  return (
    <div className="content">
      <div className="user">
        <i className="fa-solid fa-user-pen"></i>
      </div>
      <h1>Đăng Ký Tài Khoản</h1>
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

          <div className="inputItem">
            <i className="fa-solid fa-shop"></i>
            <input
              type="text"
              placeholder="Tên quán"
              id="shopName"
              value={shop.shopName}
              onChange={handleChangeInput}
            />
          </div>
          <p className="alert">{alert.shopName}</p>

          <div className="inputItem">
            <i className="fa-solid fa-location-dot"></i>

            <input
              type="text"
              placeholder="Địa chỉ"
              id="shopAddress"
              value={shop.shopAddress}
              onChange={handleChangeInput}
            />
          </div>
          <p className="alert">{alert.shopAddress}</p>

          <button type="button" onClick={handleDangKy}>
            Đăng ký
          </button>
          <span
            className="navigation"
            onClick={() => {
              navigate("/dang-nhap");
            }}
          >
            Quay về trang đăng nhập
          </span>
        </form>
        <p>
          Hotline: <a href="tel:0909240886">0909240886</a>{" "}
        </p>
      </div>
    </div>
  );
};

export default DangKy;
