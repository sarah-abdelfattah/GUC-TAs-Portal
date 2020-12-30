import React from "react";
import add from "../assets/add.svg";

function Add(props) {
  return (
    <div className="crud-button crud-add green">
      <img src={add} alt="add-icon" className="icon" />
      <h5 className="text">Add {props.text} </h5>
    </div>
  );
}

export default Add;
