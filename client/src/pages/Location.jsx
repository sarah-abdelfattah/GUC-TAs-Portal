import React, { useState } from "react";

//components
import Add from "../components/Add";
import Update from "../components/Update";
import Delete from "../components/Delete";

import AddLocation from "../components/location/AddLocation";

function Location() {
  const [crudBtns, setBtns] = useState({
    add: false,
    update: false,
    delete: false,
  });

  return (
    <div className="location-container">
      <div className="crud-container">
        <Add
          text="location"
          onClick={() =>
            setBtns({
              add: true,
              update: false,
              delete: false,
            })
          }
        />
        <Update
          text="location"
          onClick={() =>
            setBtns({
              add: false,
              update: true,
              delete: false,
            })
          }
        />
        <Delete
          text="location"
          onClick={() =>
            setBtns({
              add: false,
              update: false,
              delete: true,
            })
          }
        />
      </div>
      {crudBtns.add ? <AddLocation /> : crudBtns.update ? null : null}
      <AddLocation />
    </div>
  );
}

export default Location;
