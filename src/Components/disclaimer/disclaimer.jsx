import React from "react";
import "./disclaimer.css";
import { useNavigate } from "react-router-dom";

const Disclaimer = ({ closeDisclaimer }) => {
  const navigate = useNavigate();

  return (
    <div className="disclaimer-container">
      <div className="disclaimer-subcontainer">
        <strong className="warning">Are you sure you want to continue?</strong>
        Login is available for authorized users only.
        Do not proceed further if you are not an authorized user.
        <div className="disclaimer-buttons">
          <button
            className="disclaimer-cancel"
            onClick={() => closeDisclaimer(false)}
          >
            Cancel
          </button>
          <button
            className="disclaimer-proceed"
            onClick={() => {
              navigate("/login");
            }}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
