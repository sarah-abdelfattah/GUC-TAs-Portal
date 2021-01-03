import React, { useState, useEffect } from "react";
// import axios from "axios";
import { link } from '../helpers/constants';
import { useToasts } from 'react-toast-notifications'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';

import {axios} from '../helpers/axios'
import "../styles/_colorSchema.scss";

function InstructorSlotsAssigned() {
    const [sats,setSats] = useState([]);
    const [suns,setSuns] = useState([]);
    const [mons,setMons] = useState([]);
    const [tuess,setTuess] = useState([]);
    const [weds,setWeds] = useState([]);
    const [thurss,setThurss] = useState([]);
    const {addToast} = useToasts();

    const orderDays = (arr)=>{
        var newArr = [];
        for(var i=0;i<5;i++){
            var found = false;
            for(var j=0;j<arr.length;j++){
                if(i===0 && arr[j].time === '8:15:00 AM'){
                    newArr[i] = {
                        Course: arr[j].coursename,
                        Location: arr[j].location
                    };
                    found = true;
                    break;
                }else if(i===1 && arr[j].time === '10:00:00 AM'){
                    newArr[i] = {
                        Course: arr[j].coursename,
                        Location: arr[j].location
                    };
                    found = true;
                    break;
                }else if(i===2 && arr[j].time === '11:45:00 AM'){
                    newArr[i] = {
                        Course: arr[j].coursename,
                        Location: arr[j].location
                    };
                    found = true;
                    break;
                }else if(i===3 && arr[j].time === '01:45:00 PM'){
                    newArr[i] = {
                        Course: arr[j].coursename,
                        Location: arr[j].location
                    };
                    found = true;
                    break;
                }else if(i===4 && arr[j].time === '03:45:00 PM'){
                    newArr[i] = {
                        Course: arr[j].coursename,
                        Location: arr[j].location
                    };
                    found = true;
                    break;
                }
            }
            if(!found){
                newArr[i] = "Free";
            }
        }
        return newArr;
    }

    useEffect(async()=>{
        const loggedInUser = localStorage.getItem("user");
		if (!loggedInUser) {
		  document.location.href = '/login'  
		}else{
            try{
                const response = await axios.get(`${link}/academicMember/courseInstructor/slotsAssignment`);
                if(response.data.error){
                    addToast(response.data.error, {appearance: 'warning',autoDismiss: true});
                }else{
                    const slotsDisplay = response.data.data;
                    var sat = [];
                    var sun = [];
                    var mon = [];
                    var tues = [];
                    var wed = [];
                    var thurs = [];
                    for(var i =0;i<slotsDisplay.length;i++){
                        for(var j=0;j<slotsDisplay[i].course_slots.length;j++){
                            var obj = {
                                coursename: slotsDisplay[i].course_name,
                                day: slotsDisplay[i].course_slots[j].day,
                                time:slotsDisplay[i].course_slots[j].time,
                                location: slotsDisplay[i].course_slots[j].location
                            }
                            switch(obj.day){
                                case 'Saturday': sat.push(obj);break;
                                case 'Sunday': sun.push(obj);break;
                                case 'Monday': mon.push(obj);break;
                                case 'Tuesday': tues.push(obj);break;
                                case 'Wednesday': wed.push(obj);break;
                                case 'Thursday': thurs.push(obj);break;
                            }
                        }
                    }
                    setSats(orderDays(sat));
                    setSuns(orderDays(sun));
                    setMons(orderDays(mon));
                    setTuess(orderDays(tues));
                    setWeds(orderDays(wed));
                    setThurss(orderDays(thurs));
                }
            }catch(e){
                console.log('~ err', e);
                document.location.href = '/unauthorized';
            }
        }
    },[]);

    return (
        <div class = "table-page-slots-style">
            <h7 class = "slots-title">Slots</h7>
            <div class = "slots-line"></div>
            <TableContainer class = "table-slots-container" component={Paper}>
                <Table class = "table-slots-style border" aria-label="customized table" size="small">
                    <TableHead className="dark-blue">
                        <TableRow>
                            <TableCell className = "border">Day/Slot</TableCell>
                            <TableCell className = "border" align = "center">&nbsp;&nbsp;1st Slot <br/> (08:15 - 09:45)</TableCell>
                            <TableCell className = "border" align = "center">&nbsp;&nbsp;2nd Slot <br/> (10:00 - 11:30)</TableCell>
                            <TableCell className = "border" align = "center">&nbsp;&nbsp;3rd Slot <br/> (11:45 - 13:15)</TableCell>
                            <TableCell className = "border" align = "center">&nbsp;&nbsp;4th Slot <br/> (13:45 - 15:15)</TableCell>
                            <TableCell className = "border"align = "center">&nbsp;&nbsp;5th Slot <br/> (15:45 - 17:15)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key = "Saturday">
                            <TableCell component="th" scope="row" className="dark-blue">
                                Saturday
                            </TableCell>
                            {sats.map((day) => (
                            <TableCell align = "center" className = {typeof(day) === 'string'?"border":"border occupied"} >{typeof(day) === 'string'?day:day.Location} <br/>&nbsp;{typeof(day) === 'string'?"\t":day.Course}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow key = "Sunday">
                            <TableCell component="th" scope="row" className="dark-blue">
                                Sunday
                            </TableCell>
                            {suns.map((day) => (
                            <TableCell align = "center" className = {typeof(day) === 'string'?"border":"border occupied"}>{typeof(day) === 'string'?day:day.Location} <br/>&nbsp;{typeof(day) === 'string'?"\t":day.Course}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow key = "Monday">
                            <TableCell component="th" scope="row" className="dark-blue">
                                Monday
                            </TableCell>
                            {mons.map((day) => (
                            <TableCell align = "center" className = {typeof(day) === 'string'?"border":"border occupied"}>{typeof(day) === 'string'?day:day.Location} <br/>&nbsp;{typeof(day) === 'string'?"\t":day.Course}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow key = "Tuesday">
                            <TableCell component="th" scope="row" className="dark-blue">
                                Tuesday
                            </TableCell>
                            {tuess.map((day) => (
                            <TableCell align = "center" className = {typeof(day) === 'string'?"border":"border occupied"}>{typeof(day) === 'string'?day:day.Location} <br/>&nbsp;{typeof(day) === 'string'?"\t":day.Course}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow key = "Wednesday">
                            <TableCell component="th" scope="row" className="dark-blue">
                                Wednesday
                            </TableCell>
                            {weds.map((day) => (
                            <TableCell align = "center" className = {typeof(day) === 'string'?"border":"border occupied"}>{typeof(day) === 'string'?day:day.Location} <br/>&nbsp;{typeof(day) === 'string'?"\t":day.Course}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow key = "Thursday">
                            <TableCell component="th" scope="row" className="dark-blue">
                                Thursday
                            </TableCell>
                            {thurss.map((day) => (
                            <TableCell align = "center" className = {typeof(day) === 'string'?"border":"border occupied"}>{typeof(day) === 'string'?day:day.Location} <br/>&nbsp;{typeof(day) === 'string'?"\t":day.Course}</TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default InstructorSlotsAssigned
