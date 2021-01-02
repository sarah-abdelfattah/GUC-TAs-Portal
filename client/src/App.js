import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
// import '../styles/Login.css'
// import '../styles/util.css'
import '../src/styles/Login.css'
import '../src/styles/util.css'

import '../src/styles/courseCoverageTable.scss'
import '../src/styles/slotsAssignedTable.scss'


//Import the styles
import 'bootstrap/dist/css/bootstrap.min.css';
// import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import 'react-pro-sidebar/dist/scss/styles.scss';
import './styles/home.scss'
import './styles/NavBar.scss';
import './styles/SideBar.scss';
import { ToastProvider } from 'react-toast-notifications'


//Import the pages
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import UnauthorizedPage from './pages/UnauthorizedPage';

import CourseCoverage from './pages/InstCourseCoverage';
import SlotsAssigned from './pages/InstructorSlotsAssigned';


function App() {
  // eslint-disable-next-line
  var currentLocation = window.location.pathname
  // eslint-disable-next-line
  var t = document.title = "GUC Portal"


  return (
    <div className="App">
      <Router>
        <div className="myApp">
          <Switch>
          <ToastProvider>
          <Route
              exact
              path="/login"
              render={(props) => <Login {...props} />}
            />
            {/* 
            <Route exact path="/home" render={(props) => <Home {...props} />} />

            <Route exact path="/" render={(props) => <Home {...props} />} /> */}

            <Route
              path="/unauthorized"
              render={(props) => <UnauthorizedPage {...props} />}
            />

            <Route exact path = "/CourseCoverage" render = {(props)=> <CourseCoverage {...props}/>} />
            <Route exact path = "/SlotsAssigned" render = {(props)=> <SlotsAssigned {...props}/>} />
          </ToastProvider>
          </Switch>

          {currentLocation === "/login" ||
            currentLocation === "/unauthorized" ? null : (
              <NavBar />
            )}
          {currentLocation === "/login" ||
            currentLocation === "/unauthorized" ? null : (
              <SideBar />
            )}
        </div>
      </Router>
    </div>
  );
}

export default App;