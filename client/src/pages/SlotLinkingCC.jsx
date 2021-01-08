import React, { useState, useEffect } from "react";
import { axios } from "../helpers/axios"
import { link } from "../helpers/constants";
import { useToasts } from "react-toast-notifications";
import Button from '@material-ui/core/Button';
import MaterialTable from "material-table";
import { Grid } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles"
import Fade from "react-reveal/Fade";

function SlotLinkingCC() {
    const {addToast} = useToasts(); 
    const [rows,setRows] = useState([]);
    useEffect(async()=>{
        try{
            const response = await axios.get(`${link}/requests/viewSlotRequest`);
            if(response.data.error){
                addToast(response.data.error, {appearance: 'warning',autoDismiss: true});
            }else{
                let myRequests = response.data.data;
                // myRequests.map((req)=>{
                //     req.tableData = req.tableData.id
                // })
                // console.log(myRequests)
                setRows(myRequests)
            }
        }catch(e){
            console.log('~ err', e);
            document.location.href = window.location.origin + "/unauthorized";
        }
    },[])
    const useStyles = makeStyles((theme)=>({
        acceptButton:{
            backgroundColor:"#00c458",
            color: "white"
            // marginLeft:"20px"
        },
        rejecttButton:{
            backgroundColor:"#ff2638",
            color: "white"
            // marginLeft:"20px"
        },
    }))
    const classes = useStyles();
    return (
        <div className="my-table">
        <Fade>
        <h3 className="general-header">Slot Requests</h3>
        <hr className="general-line" />
        <Grid container justify = "center" alignItems = "center" spacing = {2}>
            <Grid item xs = {10} sm ={10} md = {9}>
                <MaterialTable
                    title=""
                    columns={[
                        // { title: 'Number', field: 'tableData'},
                        { title: "Course name", field: "coursename" },
                        { title: "Date", field: "date" },
                        { title: "Location type", field: "locationType"},
                        { title: "Sender", field: "sender.gucId"},
                        { title: "Status", field: "status"},
                        { title: "Subject", field: "subject"},
                    ]}
                    data={rows}
                    actions={[
                        {
                        icon: 'save',
                        tooltip: 'Save User',
                        onClick: (event, rowData) => console.log("You saved " + rowData.sender.gucId)
                        }
                    ]}
                    options={{
                        headerStyle: {
                        backgroundColor: '#01579b',
                        color: '#FFF'
                        }
                    }}
                    components={{
                        Action: props => (
                            <div style = {{width:"150px"}}>
                                <Button
                                    onClick={(event) => props.action.onClick(event, props.data)}
                                    // color="primary"
                                    // class = "green"
                                    // style = {{backgroundColor: "#058c42"}}
                                    className = {classes.acceptButton}
                                    variant="contained"
                                    style={{textTransform: 'none'}}
                                    size="small"
                                    value = "accept"
                                >
                                    Accept
                                </Button>
                                &nbsp;&nbsp;
                                <Button
                                    onClick={(event) => props.action.onClick(event, props.data)}
                                    // color="secondary"
                                    className = {classes.rejecttButton}
                                    variant="contained"
                                    style={{textTransform: 'none'}}
                                    size="small"
                                    value = "reject"
                                >
                                    Reject
                                </Button>
                            </div>
                        ),
                    }}/>
            </Grid>
        </Grid>
        </Fade>
        </div>
    )
}

export default SlotLinkingCC
