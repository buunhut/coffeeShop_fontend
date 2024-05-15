import React, { useRef, useState } from "react";
import { capitalizeFirstLetter, API, saveMenu } from "../../SellPage";
import axios from "axios";
import { updateIsLoading } from "../../../redux/slice/settingSlice";
import { useDispatch } from "react-redux";
import { updateMenu, updateMenuActive } from "../../../redux/slice/menuSlice";

const CategoryItemSettingMode = ({
  item,
  getCategory,
  headers,
  index,
  menuActive,
  menu,
}) => {
  const { categoryId, categoryName } = item;
  const dispatch = useDispatch();

  const [categoryValue, setCategoryValue] = useState({});
  const editCategoryName = async (e, categoryId) => {
    const data = {
      categoryId,
      categoryName: e.target.value,
    };
    dispatch(updateIsLoading(true));
    try {
      const res = await axios({
        method: "put",
        url: `${API}/category`,
        data,
        headers,
      });
      // console.log(res.data.statusCode);

      if (res.data.statusCode === 200) {
        getCategory();
        setCategoryValue({});
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(updateIsLoading(false));
    }
  };
  const handleDeleteCategory = async (item) => {
    const confirmPayment = window.confirm(
      `Bạn có chắc muốn xoá ${capitalizeFirstLetter(item.categoryName)} ?`
    );
    if (!confirmPayment) {
      return;
    }

    dispatch(updateIsLoading(true));
    const localMenu = JSON.parse(localStorage.getItem("menu"));
    const findIndex = localMenu.findIndex(
      (localItem) => localItem.categoryId === item.categoryId
    );
    if (findIndex !== -1) {
      // Nếu phần tử được tìm thấy
      localMenu.splice(findIndex, 1); // Loại bỏ phần tử tại vị trí findIndex
      saveMenu(localMenu);

      try {
        const { categoryId } = item;
        const data = { categoryId };
        const res = await axios({
          method: "delete",
          url: `${API}/category`,
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
    }
  };
  const handleSelectMenu = (index) => {
    dispatch(updateMenuActive(index));
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  // console.log(menu);

  const handleDrop = async (e, dropIndex) => {
    const dragIndex = parseInt(e.dataTransfer.getData("index"));
    const newMenu = [...menu];
    const draggedItem = newMenu[dragIndex];
    newMenu.splice(dragIndex, 1);
    newMenu.splice(dropIndex, 0, draggedItem);
    // console.log(newMenu);
    saveMenu(newMenu);
    dispatch(updateMenu(newMenu));
  };

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, index)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, index)}
      //
      id={categoryId}
      className="sliderItem"
      style={{
        marginLeft: index === 0 ? "5px" : null,
        borderColor: index === menuActive ? "red" : null,
        cursor: "move",
      }}
      onClick={() => handleSelectMenu(index)}
    >
      <input
        onChange={(e) => {
          const value = e.target.value;
          setCategoryValue((prev) => ({
            ...prev,
            [categoryId]: value, // Cập nhật giá trị cho categoryId tương ứng
          }));
        }}
        onBlur={(e) => editCategoryName(e, categoryId)}
        value={
          categoryValue[categoryId] !== undefined
            ? capitalizeFirstLetter(categoryValue[categoryId])
            : capitalizeFirstLetter(categoryName)
        }
      />
      <i
        className="fa-solid fa-trash-can deleteCategory"
        onClick={() => handleDeleteCategory(item)}
      ></i>
    </div>
  );
};

export default CategoryItemSettingMode;
