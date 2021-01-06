import React from "react";
import view from "../assets/view.svg";

function View(props) {
  return (
    <div className="crud-button crud-view blue" onClick={props.onClick}>
      <img src={view} alt="add-icon" className="icon" />
      <h5 className="text">View {props.text} </h5>
    </div>
    
  );
}

export default View;