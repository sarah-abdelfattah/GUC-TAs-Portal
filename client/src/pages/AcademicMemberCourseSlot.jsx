import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { link } from '../helpers/constants';

import Button from '@material-ui/core/Button';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useToasts } from 'react-toast-notifications'


import {axios} from '../helpers/axios';
import "../styles/_colorSchema.scss";

function AcademicMemberCourseSlot() {
    const [courses,setCourses] = useState([]);
    const [course,setCourse] = useState("");
    const {addToast} = useToasts();

    // const handleSelectChange = (e)=>{
    //     setCourse(e.target.value);
    // }
    const useStyles = makeStyles((theme) => ({
        // formControl: {
        //   margin: theme.spacing(1),
        //   minWidth: 120,
        // },
        // selectEmpty: {
        //   marginTop: theme.spacing(2),
        // },
        button: {
            // margin: theme.spacing(3),
            backgroundColor: "#0087a2",
            color: "white",
            left: "400px",
            bottom:"25px"
        },
    }));
    const classes = useStyles();

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
                    const coursesState = coverageDisplay.map((course)=>{
                        return course.course_name;
                    })
                    setCourses(coursesState);
                }
            }catch(e){
                console.log('~ err', e);
                document.location.href = window.location.origin + "/unauthorized";
            }
        }
    },[]);


    return (
        <div>
            <div className = "course-slots-container">
                {/* <FormControl required className={classes.formControl}>
                    <InputLabel id="demo-simple-select-required-label">Course</InputLabel>
                        <Select
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            value={course}
                            onChange={handleSelectChange}
                            className={classes.selectEmpty}
                            >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {courses.map((coursename)=>{
                                console.log(coursename);
                                <MenuItem value={coursename}>{coursename}</MenuItem>
                                })
                            }
                        </Select>
                    <FormHelperText>Required</FormHelperText>
                </FormControl> */}
                <Autocomplete
                    id="courses-dropdown"
                    options={courses}
                    getOptionLabel={(coursename) => coursename}
                    onChange = {handleOnChange(e)}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Course" variant="outlined" />}
                    className= "courses-dropdown"
                />
            </div>
        </div>
    );
}

export default AcademicMemberCourseSlot
