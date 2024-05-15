// import React, { useState } from "react";

// const Demo = () => {
//   const [menu, setMenu] = useState([
//     { id: 1, name: "menu 1" },
//     { id: 2, name: "menu 2" },
//     { id: 3, name: "menu 3" },
//     { id: 4, name: "menu 4" },
//     { id: 5, name: "menu 5" },
//   ]);

//   const handleDragStart = (e, index) => {
//     e.dataTransfer.setData("index", index);
//   };

//   const handleDrop = (e, dropIndex) => {
//     const dragIndex = parseInt(e.dataTransfer.getData("index"));
//     const newMenu = [...menu];
//     const draggedItem = newMenu[dragIndex];
//     newMenu.splice(dragIndex, 1);
//     newMenu.splice(dropIndex, 0, draggedItem);
//     setMenu(newMenu);
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         gap: "20px",
//         width: "1000px",
//         margin: "0 auto",
//       }}
//     >
//       {menu.map((item, index) => (
//         <h3
//           key={item.id}
//           draggable
//           onDragStart={(e) => handleDragStart(e, index)}
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={(e) => handleDrop(e, index)}
//           style={{ cursor: "move" }}
//         >
//           {item.name}
//         </h3>
//       ))}
//     </div>
//   );
// };

// export default Demo;

import React from "react";

const Demo = () => {
  const content = [
    { categoryId: 12, categoryName: "món mới" },
    { categoryId: 11, categoryName: "sinh tố" },
    { categoryId: 10, categoryName: "đồ chơi" },
    { categoryId: 7, categoryName: "ăn vặt" },
    { categoryId: 4, categoryName: "nước ép" },
    { categoryId: 3, categoryName: "đồ ăn" },
    { categoryId: 1, categoryName: "cà phê" },
  ];
  const local = [
    { categoryId: 1 },
    { categoryId: 11 },
    { categoryId: 4 },
    { categoryId: 3 },
    { categoryId: 7 },
  ];
//   let stringId = "";
//   local.map((item) => (stringId += item.categoryId + "|"));
//   console.log(stringId);

  //   const sort = content.map((contentItem) =>
  //     local.find((localItem) => localItem.categoryId === contentItem.categoryId)
  //   );
  console.log("content", content);

  const sort = [];
  const notIn = [];
  local.map((localItem) => {
    const find = content.find(
      (contentItem) => localItem.categoryId === contentItem.categoryId
    );
    if (find) {
      sort.push(find);
    }
  });

  console.log("sort", sort);

  content.map((contentItem) => {
    const find = local.find(
      (localItem) => localItem.categoryId === contentItem.categoryId
    );
    if (!find) {
      notIn.push(contentItem);
    }
  });

  const combine = [...sort, ...notIn];
  console.log("combine", combine);
  return <div>Demo</div>;
};

export default Demo;
