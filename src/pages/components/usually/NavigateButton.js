import React from "react";
import "./navigatebutton.scss";
import { useNavigate } from "react-router-dom";

const NavigateButton = ({ text, link }) => {
  const navigate = useNavigate();
  return (
    <div className="navigateButton">
      <p
        onClick={() => {
          navigate(`${link}`);
        }}
      >
        {text}
      </p>
    </div>
  );
};

export default NavigateButton;
