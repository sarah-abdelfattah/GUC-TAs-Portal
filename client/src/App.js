import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import '../src/styles/courseCoverageTable.scss'
import '../src/styles/slotsAssignedTable.scss'
import '../src/styles/courseSlot.scss'


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

//Import the pages
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import Homepage from './pages/Homepage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Login from './pages/Login';
import Location from './pages/Location';
import Faculty from "./pages/Faculty";
import Department from "./pages/Department";
import ViewAllStaff from './pages/HOD/ViewAllStaff';
import ViewCourseCoverage from './pages/HOD/ViewCourseCoverage';

import CourseCoverage from './pages/InstCourseCoverage';
import SlotsAssigned from './pages/InstructorSlotsAssigned';
import Schedule from './pages/AcademicMemberSchedule';
import CourseSlot from './pages/AcademicMemberCourseSlot';


function App() {
  // eslint-disable-next-line
  var currentLocation = window.location.pathname;
  // eslint-disable-next-line
  var t = (document.title = 'GUC Portal');

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
                <Route path='/home' render={(props) => <Homepage {...props} />} />
                <Route path='/location' render={(props) => <Location {...props} />} />
                <Route path='/faculty' render={(props) => <Faculty {...props} />} />
                <Route path='/department' render={(props) => <Department {...props} />} />
                <Route exact path="/viewStaff" render={(props) => <ViewAllStaff {...props} />} />
                <Route exact path="/viewCourseCoverage" render={(props) => <ViewCourseCoverage {...props} />} />
                <Route exact path = "/CourseCoverage" render = {(props)=> <CourseCoverage {...props}/>} />
                <Route exact path = "/SlotsAssigned" render = {(props)=> <SlotsAssigned {...props}/>} />
                <Route exact path = "/viewMySchedule" render = {(props)=> <Schedule {...props}/>} />
                <Route exact path = "/courseSlots" render = {(props)=> <CourseSlot {...props}/>} />
            <Route
              path="/unauthorized"
              render={(props) => <UnauthorizedPage {...props} />}
            />
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
