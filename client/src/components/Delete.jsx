import React from "react";

import deleteSVG from "../assets/delete.svg";

function Delete(props) {
  return (
    <div className="crud-button crud-delete red">
      <img src={deleteSVG} alt="Delete-icon" className="icon" />
      <h5 className="text">Delete {props.text} </h5>
    </div>
  );
}

export default Delete;
