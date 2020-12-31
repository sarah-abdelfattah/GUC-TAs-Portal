import React, { useState } from "react";

//components
import Add from "../components/Add";
import Update from "../components/Update";
import Delete from "../components/Delete";

import AddFaculty from "../components/faculty/AddFaculty";
import UpdateFaculty from "../components/faculty/UpdateFaculty";
import DeleteFaculty from "../components/faculty/DeleteFaculty";

function Faculty() {
  const [crudBtns, setBtns] = useState({
    add: false,
    update: false,
    delete: false,
  });

  return (
    <div className="crud-outer-container">
      <div className="crud-container">
        <Add
          text="Faculty"
          onClick={() =>
            setBtns({
              add: true,
              update: false,
              delete: false,
            })
          }
        />
        <Update
          text="Faculty"
          onClick={() =>
            setBtns({
              add: false,
              update: true,
              delete: false,
            })
          }
        />
        <Delete
          text="Faculty"
          onClick={() =>
            setBtns({
              add: false,
              update: false,
              delete: true,
            })
          }
        />
      </div>
      {crudBtns.add === true ? (
        <AddFaculty />
      ) : crudBtns.update ? (
        <UpdateFaculty />
      ) : (
        <DeleteFaculty />
      )}
    </div>
  );
}

export default Faculty;
