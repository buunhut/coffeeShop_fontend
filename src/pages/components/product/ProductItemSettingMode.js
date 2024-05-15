import React, { useState } from "react";
import "./productItemSettingMode.scss";
import axios from "axios";
import { useDispatch } from "react-redux";
import { API, capitalizeFirstLetter } from "../../SellPage";
import { updateIsLoading } from "../../../redux/slice/settingSlice";

const ProductItemSettingMode = ({ product, getCategory, headers }) => {
  const dispatch = useDispatch();
  //function
  const [menuItemValue, setMenuItemValue] = useState({});
  const [menuItemEdit, setMenuItemEdit] = useState({});

  const editMenuItem = async () => {
    const data = { ...menuItemEdit };
    dispatch(updateIsLoading(true));
    try {
      const res = await axios({
        method: "put",
        url: `${API}/menu-item`,
        headers,
        data,
      });
      console.log(res);
      if (res.data.statusCode === 200) {
        getCategory();
        setMenuItemValue({});
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(updateIsLoading(false));
    }
  };
  //upload hình sản phẩm
  const uploadMenuItemImage = async (event, item) => {
    dispatch(updateIsLoading(true));
    const file = event.target.files[0]; // Lấy tệp đầu tiên từ danh sách đã chọn
    if (file) {
      const formData = new FormData();
      formData.append("id", item.menuId);
      formData.append("image", file);
      try {
        const res = await axios({
          method: "post",
          url: `${API}/up-load-menu-image`,
          data: formData,
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
    }
  };
  const deleteMenuItemImage = async (item) => {
    dispatch(updateIsLoading(true));
    const data = { id: item.menuId };
    try {
      const res = await axios({
        method: "delete",
        url: `${API}/delete-menu-image`,
        data,
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
  const handleDeleteMenuItem = async (item) => {
    const confirmPayment = window.confirm(
      `Bạn có chắc muốn xoá ${capitalizeFirstLetter(item.menuName)} ?`
    );
    if (!confirmPayment) {
      return;
    }
    dispatch(updateIsLoading(true));
    const { menuId } = item;
    const data = { menuId };
    const res = await axios({
      method: "delete",
      url: `${API}/menu-item`,
      data,
      headers,
    });
    if (res.data.statusCode === 200) {
      getCategory();
    }
    try {
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(updateIsLoading(false));
    }
  };

  const { menuId, menuName, menuImage, menuPrice } = product;
  return (
    <div className="productItemSettingMode">
      <div className="productContent">
        <div
          className="product"
          onClick={() => {
            setMenuItemEdit(product);
          }}
        >
          <div className="image">
            {menuImage ? (
              <>
                <img
                  src={`${API}/${menuImage}`}
                  alt="hình"
                  style={{ width: "100%", height: "100%" }}
                />
                <i
                  className="fa-regular fa-image deleteImg"
                  onClick={() => deleteMenuItemImage(product)}
                ></i>
              </>
            ) : (
              <div className="upload">
                <label className="custom-file-upload">
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/gif"
                    onChange={(e) => uploadMenuItemImage(e, product)}
                  />
                  <i className="fa-regular fa-image "></i>
                </label>
              </div>
            )}
          </div>
          <div className="title">
            <div className="name">
              <input
                className="name"
                onChange={(e) => {
                  const { value } = e.target;
                  setMenuItemValue((prev) => ({
                    ...prev,
                    [menuId]: {
                      ...prev[menuId],
                      menuName: value,
                    },
                  }));
                  setMenuItemEdit((prev) => ({
                    ...prev,
                    menuName: value,
                  }));
                }}
                onBlur={() => editMenuItem()}
                value={
                  menuItemValue[menuId]?.menuName !== undefined
                    ? capitalizeFirstLetter(menuItemValue[menuId].menuName)
                    : capitalizeFirstLetter(menuName)
                }
              />
            </div>
            <div className="price_button">
              <div className="price">
                <input
                  className="price"
                  onChange={(e) => {
                    const value = e.target.value.replaceAll(/[^0-9]/g, "");
                    setMenuItemValue((prev) => ({
                      ...prev,
                      [menuId]: {
                        ...prev[menuId],
                        menuPrice:
                          +value.replaceAll(/[^0-9]/g, "") === null
                            ? 0
                            : +value.replaceAll(/[^0-9]/g, ""),
                      },
                    }));
                    setMenuItemEdit((prev) => ({
                      ...prev,
                      menuPrice: +value.replaceAll(/[^0-9]/g, ""),
                    }));
                  }}
                  onBlur={() => editMenuItem(menuId)}
                  value={
                    menuItemValue[menuId]?.menuPrice !== undefined
                      ? menuItemValue[menuId]?.menuPrice === 0
                        ? ""
                        : menuItemValue[menuId]?.menuPrice?.toLocaleString()
                      : menuPrice?.toLocaleString() + "đ"
                  }
                />
              </div>
            </div>
          </div>
          <i
            className="fa-solid fa-trash-can deleteMenuItem"
            onClick={() => handleDeleteMenuItem(product)}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default ProductItemSettingMode;
