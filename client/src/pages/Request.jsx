import React, { useState, useEffect } from "react";
import auth from "../helpers/auth";
//components
import Send from "../components/Send";
import View from "../components/View";
import Cancel from "../components/Delete";
import Accept from "../components/Accept";

import Sendd from "../components/request/send";
// import UpdateDepartment from "../components/department/UpdateDepartment";
// import DeleteDepartment from "../components/department/DeleteDepartment";

function Request() {
  //var user = checkLogin() ;  //a3ml wait 1000 seconds msln
 
   useEffect(() => {
    async function fetchData() {
     await auth(["Course Instructor","Teaching Assistant"]);
    }
    fetchData();
  }, []);
  //  useEffect(async () => {
   
    
  // }, []);
// <div className="crud-outer-container">
return(

 <div className="crud-outer-container">
       
      <div className="crud-container">
        <Send text="Request"/>
        </div>
        <div className="crud-container">
        <View text="Requests"  />
        </div>
        <div className="crud-container">
        <Accept text="Request" />
        </div>
         <div className="crud-container">
         <Cancel  text="Request" 
        />
      </div>
      </div>
       
     
)
}
export default Request;
// {crudBtns.send ? (
//          <h1>  </h1>
//       ) : crudBtns.view ? (
//         <h1> hello it is view</h1>
//       ) : crudBtns.accept ? (
//         <h1> hello it is accept</h1>
//       ) : 
//       crudBtns.cancel ? (
//         <h1> hello it is cancel</h1>):
//       null}