import React from "react";
import { capitalizeFirstLetter } from "../../SellPage";
import { useDispatch } from "react-redux";
import { updateMenuActive } from "../../../redux/slice/menuSlice";

const CategoryItem = ({ item, index, menuActive }) => {
  const { categoryName } = item;

  const dispatch = useDispatch();
  const handleSelectMenu = (index) => {
    dispatch(updateMenuActive(index));
  };

  return (
    <div
      className="sliderItem"
      style={{
        marginLeft: index === 0 ? "5px" : null,
        borderColor: index === menuActive ? "red" : null,
      }}
      onClick={() => handleSelectMenu(index)}
    >
      <p>{capitalizeFirstLetter(categoryName)}</p>
    </div>
  );
};

export default CategoryItem;
