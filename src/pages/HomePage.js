import React, { useEffect, useState } from "react";
import "./homepage.scss";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div id="homePage">
      <div className="homePageContent">
        <h2>Miễn phí</h2>
        <h1
          onClick={() => {
            navigate("/admin");
          }}
        >
          Dùng thử
        </h1>
        <p>Sử dụng cho quán cà phê nhỏ</p>
      </div>
    </div>
  );
};

export default HomePage;
