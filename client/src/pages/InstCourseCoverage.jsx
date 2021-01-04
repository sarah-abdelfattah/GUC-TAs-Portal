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


// import {axiosInstance} from '../helpers/setAuthToken'

function InstCourseCoverage() {

    const [rows,setRows] = useState([]);
    const {addToast} = useToasts();

    useEffect(async()=>{
        const loggedInUser = localStorage.getItem("user");
		if (!loggedInUser) {
		  document.location.href = '/login'  
		}else{
            try{
                const response = await axios.get(`${link}/academicMember/courseInstructor/courseCoverage`);
                if(response.data.error){
                    addToast(response.data.error, {appearance: 'warning',autoDismiss: true});
                }else{
                    const coverageDisplay = response.data.data;
                    setRows(coverageDisplay);
                }
            }catch(e){
                console.log('~ err', e);
                document.location.href = '/unauthorized';
            }
        }
    },[]);

    return (
        <div class = "table-page-style">
            <h7 class = "coverage-title">Courses Coverage</h7>
            <div class = "line"></div>
            <TableContainer class = "table-container" component={Paper}>
                <Table class = "table-style" aria-label="customized table">
                    <TableHead className="dark-blue">
                        <TableRow>
                            <TableCell>Course Name</TableCell>
                            <TableCell align = "center">Coverage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key = {row.course_name}>
                                <TableCell component="th" scope="row" >
                                    {row.course_name}
                                </TableCell>
                                <TableCell align = "center">{row.course_coverage}</TableCell>
                            </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default InstCourseCoverage
