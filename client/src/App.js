import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

//Import the styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-pro-sidebar/dist/scss/styles.scss';
import '../src/styles/Login.css';
import '../src/styles/util.css';
import './styles/home.scss';
import "./styles/Homepage.scss";
import "./styles/UnauthorizedPage.scss";
import './styles/NavBar.scss';
import './styles/SideBar.scss';
import './styles/crudButtons.scss';
import './styles/attendanceRecord.scss';
import './styles/profile.scss';
import './styles/ChangePassword.scss';


//Import the pages
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import Homepage from './pages/Homepage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Login from './pages/Login';
import Location from './pages/Location';
import Faculty from "./pages/Faculty";
import Department from "./pages/Department";
import Course from "./pages/Course";
import MyAttendanceRecord from "./pages/MyAttendanceRecord";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";


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
            {currentLocation === '/login' || currentLocation === '/unauthorized' ?
              <div>
                <Route
                  exact
                  path="/login"
                  render={(props) => <Login {...props} />}
                />
                <Route path='/unauthorized' render={(props) => <UnauthorizedPage {...props} />} />
              </div> :
              <div className='myApp'>
                <Route exact path='/home' render={(props) => <Homepage {...props} />} />
                <Route exact path='/location' render={(props) => <Location {...props} />} />
                <Route exact path='/faculty' render={(props) => <Faculty {...props} />} />
                <Route exact path='/department' render={(props) => <Department {...props} />} />
                <Route exact path='/course' render={(props) => <Course {...props} />} />
                <Route exact path='/myAttendanceRecord' render={(props) => <MyAttendanceRecord {...props} />} />
                <Route exact path='/profile' render={(props) => <Profile {...props} />} />
                <Route exact path='/changePassword' render={(props) => <ChangePassword {...props} />} />
              </div>
            }
          </ToastProvider>
        </Switch>
      </Router>
      {currentLocation === '/login' || currentLocation === '/unauthorized' ? null : <NavBar />}
      {currentLocation === '/login' || currentLocation === '/unauthorized' ? null : <SideBar />}
    </div>
  );
}

export default App;
