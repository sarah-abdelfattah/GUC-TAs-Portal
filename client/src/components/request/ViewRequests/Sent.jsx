 
import React, { useState, useEffect } from "react";
 
import axiosCall from "../../../helpers/axiosCall";
 
import { useToasts } from "react-toast-notifications";
import Button from '@material-ui/core/Button';
import MaterialTable from "material-table";
import { Grid } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles"
import Fade from "react-reveal/Fade";
import { link } from "../../../helpers/constants.js";
 
function Sent() {
    const {addToast} = useToasts(); 
    const [rows,setRows] = useState([]);
    const [reqIDRes,setReqIDRes] = useState(0);
    
    
    useEffect(async()=>{
        try{
         
            const response =   await axiosCall("get", "requests/viewMyRequest");
            if(response.data.error){
                addToast(response.data.error, {appearance: 'warning',autoDismiss: true});
            }
            else{ 
      let myRequests  = response.data.data.map((req) => {
              return {
                id:req._id,
                date:  req.date,
                status: req.status,
                subject: req.subject, 
              };
            });
            
                setRows(myRequests)
            }
        }catch(e){
            console.log('~ err', e);
          //  document.location.href = window.location.origin + "/unauthorized";
        }
    },[])
    
 const handleSubmit= async (e,rowData) =>{
try{
 console.log("heloooooo")
}
catch(e){
            console.log('~ err', e);
           // document.location.href = window.location.origin + "/unauthorized";
        }

 }
    // const handleSubmit = async (e,rowData) =>{
    //     let submittedStatus = e.currentTarget.value;
    //     try{

             
    //         const response = await axiosCall("put", "requests/acceptRejectSlotLinking", {
    //             reqNumber: rowData.id,
    //             status: submittedStatus
    //         });
           
    //         if(response.data.error){
    //             addToast(response.data.error, {appearance: 'warning',autoDismiss: true});
    //         }else{
    //             if(submittedStatus === "accepted" && response.data.data === "The slot-linking request is rejected successfully"){
    //                 addToast(`The slot-linking request is rejected since there is no locations of type ${rowData.locationType} at the requested time.`,
    //                 {appearance: 'warning',autoDismiss: true});
    //             }else{
    //                 addToast(response.data.data, {appearance: 'success',autoDismiss: true});
    //             }
    //             setReqIDRes(rowD ata.id)
    //         }
    //     }catch(e){
    //         console.log('~ err', e);
    //        // document.location.href = window.location.origin + "/unauthorized";
    //     }
   // }
    
    return (
        <div className="my-table"> 
        <Fade>
        <h3 className="general-header">My Requests</h3>
        <hr className="general-line" />
        <Grid container justify = "center" alignItems = "center" spacing = {2}>
            <Grid item xs = {10} sm ={10} md = {10}>
                <MaterialTable
                    title=""
                    columns={[
                      
                        { title: "Date", field: "date"}, 
                        { title: "Subject", field: "subject"}, 
                        { title: "Status", field: "status"},
                    ]}
                    data={rows} 
                    onRowClick={(event, rowData) => {
                         
                      document.location.href = `/viewReq/${rowData.id}`
                    
                      
                    }}

                    
                    options={{
                        headerStyle: {
                        backgroundColor: '#01579b',
                        color: '#FFF'
                        }
                    }}
                       />
            </Grid>
        </Grid>
        </Fade>
        </div>
    )
  }
 
export default Sent;
