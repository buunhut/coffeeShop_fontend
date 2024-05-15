import React from "react";
import "./productItem.scss";
import {
  capitalizeFirstLetter,
  API,
  speak,
  truncateString,
} from "../../SellPage";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateIsLoading } from "../../../redux/slice/settingSlice";

const ProductItem = ({ product, getListOrder, headers }) => {
  const dispatch = useDispatch();
  const { tableSelected } = useSelector((state) => state.tableSlice);
  const { user } = useSelector((state) => state.userSlice);

  // console.log(user);

  const { menuName, menuImage, menuPrice, menuDiscount, totalSale } = product;

  //chọn món
  const handleOrder = async (item) => {
    speak(tableSelected.tableName + " gọi " + item.menuName);
    const { tableId } = tableSelected;
    const { menuId, menuName, menuPrice, menuDiscount } = item;
    const { staffId, staffName } = user;
    const data = {
      tableId, //number
      order: {
        menuId,
        name: menuName, //string
        price: menuDiscount > 0 ? menuDiscount : menuPrice, //number
        staffId,
        staffName,
      },
    };
    dispatch(updateIsLoading(true));
    try {
      const res = await axios({
        method: "post",
        url: `${API}/bill/create-order`,
        data,
        headers,
      });
      if (res.data.statusCode === 200) {
        getListOrder();
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(updateIsLoading(false));
    }
  };
  return (
    <div className="productItem">
      <div className="productContent">
        <div className="product">
          <div className="image">
            <img
              src={
                menuImage ? `${API}/${menuImage}` : `${API}/defaultImage.jpeg`
              }
              alt="hình"
              style={{ width: "100%", height: "100%" }}
            />
            {totalSale > 0 && (
              <div className="totalSale">
                Đã bán: {totalSale?.toLocaleString()}
              </div>
            )}
          </div>

          <div className="title">
            <div className="name">
              <h4>{truncateString(capitalizeFirstLetter(menuName), 22)}</h4>
            </div>
            <div className="price">
              <div className="leftPrice">
                <h4>
                  {menuDiscount > 0
                    ? menuDiscount.toLocaleString()
                    : menuPrice.toLocaleString()}
                  đ
                </h4>
              </div>
              <div className="button">
                {tableSelected && (
                  <button onClick={() => handleOrder(product)}>
                    Chọn <i className="fa-regular fa-hand-point-right"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
