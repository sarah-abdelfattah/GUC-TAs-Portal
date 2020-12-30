// import React, { useState, useEffect } from "react";
// import axiosCall from "../../helpers/axiosCall";

// import {
//   FormControl,
//   InputLabel,
//   //   Input,
//   Select,
//   FormHelperText,
//   MenuItem,
// } from "@material-ui/core";

// function UpdateLocation() {
//   const [rooms, setRooms] = useState({ rooms: [] });
//   const [roomChosen, setRoomChosen] = useState("start");

//   useEffect(() => {
//     async function fetchData() {
//       const result = await axiosCall("get", "locations/room/all");
//       setRooms(result.data.data);
//     }
//     fetchData();
//   }, []);

//   const handleOnChange = (target) => {
//     setRoomChosen(target.value);
//   };

//   return (
//     <div className="crud-inner-container">
//       <FormControl className="crud-formControl" required>
//         <InputLabel className="crud-inputLabel">Location</InputLabel>
//         <Select
//           value={roomChosen}
//           onChange={(event) => {
//             handleOnChange(event.target);
//           }}
//         >
//           {rooms.length > 0 &&
//             rooms.map((room) => (
//               <MenuItem className="crud-menuItem" value={room._id}>
//                 {room.type} - {room.location}
//               </MenuItem>
//             ))}
//         </Select>
//         <FormHelperText className="crud-helperText">
//           This field is required
//         </FormHelperText>
//       </FormControl>
//     </div>
//   );
// }

// export default UpdateLocation;
