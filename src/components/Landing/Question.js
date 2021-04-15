import React, { useState, useEffect } from "react";

import "../../stylesheets/Question.css";
import triangleIcon from "../../media/icons/triangleIcon.png";

export default function Question(props) {
  const { open } = props;
  const [isOpen, setisOpen] = useState(open);

  useEffect(() => {
    setisOpen(open);
  }, [open]);

  return (
    <button
      className="Question-wrapper"
      onClick={() => setisOpen((prevState) => !prevState)}
    >
      <div
        className={`Question-header ${isOpen ? "Question-header-active" : ""}`}
      >
        <div className="Question-hover"></div>
        <img
          src={triangleIcon}
          alt="triangleIcon"
          className={`Question-header-icon ml-2 ${
            isOpen ? "Question-header-icon-active" : ""
          }`}
        />
        <p className="ml-2 mb-0">{props.header}</p>
      </div>
      <div
        className={`Question-content-wrapper ${
          isOpen ? "Question-content-wrapper-active" : ""
        }`}
      >
        <div className="Question-content">
          <p>{props.content}</p>
        </div>
      </div>
    </button>
  );
}
