import React from "react";
import MaterialTable from "material-table";

function ViewAllStaff() {
  return (
    // styling
    <div
      className="container"
      style={{
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50% , -50%)",
          width: "100%",
          height: "100%",
          background: "#F8F8F8",
        }}
      >
        {" "}
        <MaterialTable
          title="Free Action Preview"
          columns={[
            { title: "Name", field: "name" },
            { title: "Surname", field: "surname" },
            { title: "Birth Year", field: "birthYear", type: "numeric" },
            {
              title: "Birth Place",
              field: "birthCity",
              lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
            },
          ]}
          data={[
            {
              name: "Mehmet",
              surname: "Baran",
              birthYear: 1987,
              birthCity: 63,
            },
            {
              name: "Zerya Betül",
              surname: "Baran",
              birthYear: 2017,
              birthCity: 34,
            },
          ]}
          actions={[
            {
              icon: "add",
              tooltip: "Add User",
              isFreeAction: true,
              onClick: (event) => alert("You want to add a new row"),
            },
          ]}
        />
      </div>
    </div>
  );
}

export default ViewAllStaff;
