import React from "react";
import send from "../assets/update.svg";

function Send(props) {
  return (
    <div className="crud-button crud-add green" onClick={props.onClick}>
      <img src={send} alt="add-icon" className="icon" />
      <h5 className="text">Send {props.text} </h5>
    </div>
    
  );
}

export default Send;