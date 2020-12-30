import React from "react";

import update from "../assets/update.svg";

function Update(props) {
  return (
    <div className="crud-button crud-update blue">
      <img src={update} alt="Update-icon" className="icon" />
      <h5 className="text">Update {props.text} </h5>
    </div>
  );
}

export default Update;
