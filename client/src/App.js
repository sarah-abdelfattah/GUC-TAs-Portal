
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import React, { useState, useEffect } from "react";
import '../src/styles/courseCoverageTable.scss';
import '../src/styles/slotsAssignedTable.scss';

//Import the styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-pro-sidebar/dist/scss/styles.scss';
import '../src/styles/Login.css';
import '../src/styles/util.css';
import './styles/home.scss';
import './styles/Homepage.scss';
import './styles/UnauthorizedPage.scss';
import './styles/NavBar.scss';
import './styles/SideBar.scss';
import './styles/crudButtons.scss';
import './styles/attendanceRecord.scss';
import './styles/profile.scss';
import './styles/ChangePassword.scss';
import './styles/tables.scss';

//Import the pages
import checkLogin from "./helpers/checkLogin";
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import Homepage from './pages/Homepage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Login from './pages/Login';
import Location from './pages/Location';
import Request from "./pages/Request";
import Faculty from './pages/Faculty';
import Department from './pages/Department';
import Course from './pages/Course';
import MyAttendanceRecord from './pages/MyAttendanceRecord';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import ViewAllStaff from './pages/HOD/ViewAllStaff';
import ViewCourseCoverage from './pages/HOD/ViewCourseCoverage';
import CourseCoverage from './pages/InstCourseCoverage';
import SlotsAssigned from './pages/InstructorSlotsAssigned';
import Schedule from './pages/AcademicMemberSchedule';
import Staff from './pages/Staff';
import StaffProfile from './pages/StaffProfile';
import NewStaffMember from './pages/NewStaffMember';
import StaffAttendance from './pages/Staff/StaffAttendance';

import Test from './pages/test';

function App() {

  // eslint-disable-next-line
  var currentLocation = window.location.pathname;
  // eslint-disable-next-line

  var t = (document.title = 'GUC Portal');

  //var user = checkLogin() ;  //a3ml wait 1000 seconds msln
  // const [flag, setFlag] = useState(false);
  // useEffect(async () => {
  //   if(currentLocation!='/login'){
  //   let user =  await checkLogin() ;
  //   if(user){
  // if(user.type=="Academic Member"){
  //   setFlag(true);
  // }
  //      } }

  // }, []);


  return (

    <div className='App'>
      <Router>
        <Switch>
          <ToastProvider>
            {currentLocation === '/login' || currentLocation === '/unauthorized' ? (
              <div>
                <Route exact path='/login' render={(props) => <Login {...props} />} />
                <Route path='/unauthorized' render={(props) => <UnauthorizedPage {...props} />} />
              </div>
            ) : (
                <div className='myApp'>
                  <Route exact path='/home' render={(props) => <Homepage {...props} />} />
                  <Route exact path='/location' render={(props) => <Location {...props} />} />
                  <Route exact path='/faculty' render={(props) => <Faculty {...props} />} />
                  <Route exact path='/department' render={(props) => <Department {...props} />} />
                  <Route exact path='/request' render={(props) => <Request {...props} />} />
                  <Route exact path='/course' render={(props) => <Course {...props} />} />
                  <Route exact path='/myAttendanceRecord' render={(props) => <MyAttendanceRecord {...props} />} />
                  <Route exact path='/profile' render={(props) => <Profile {...props} />} />
                  <Route exact path='/changePassword' render={(props) => <ChangePassword {...props} />} />
                  <Route exact path='/viewStaff' render={(props) => <ViewAllStaff {...props} />} />
                  <Route exact path='/viewCourseCoverage' render={(props) => <ViewCourseCoverage {...props} />} />
                  <Route exact path='/CourseCoverage' render={(props) => <CourseCoverage {...props} />} />
                  <Route exact path='/SlotsAssigned' render={(props) => <SlotsAssigned {...props} />} />
                  <Route exact path='/viewMySchedule' render={(props) => <Schedule {...props} />} />
                  <Route exact path='/staff' render={(props) => <Staff {...props} />} />
                  <Route exact path='/test' render={(props) => <Test {...props} />} />
                  <Route exact path='/staffProfile/:gucId' render={(props) => <StaffProfile {...props} />} />
                  <Route exact path='/newStaffMember' render={(props) => <NewStaffMember {...props} />} />
                  <Route exact path='/viewStaffAttendance/:gucId' render={(props) => <StaffAttendance {...props} />} />
                </div>
              )}
          </ToastProvider>
        </Switch>
      </Router>
      {currentLocation === '/login' || currentLocation === '/unauthorized' ? null : <NavBar />}
      {currentLocation === '/login' || currentLocation === '/unauthorized' ? null : <SideBar />}
    </div>
  );
}

export default App;
