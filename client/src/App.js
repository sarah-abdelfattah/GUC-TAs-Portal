import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastProvider } from 'react-toast-notifications'

//Import the styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-pro-sidebar/dist/scss/styles.scss';
import './styles/home.scss'
import './styles/NavBar.scss';
import './styles/SideBar.scss';
import './styles/crudButtons.scss';


//Import the pages
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Location from './pages/Location';
import Faculty from "./pages/Faculty.";


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
                path="/unauthorized"
                render={(props) => <UnauthorizedPage {...props} />}
              />

              <Route
                path="/location"
                render={(props) => <Location {...props} />}
              />

              <Route
                path="/faculty"
                render={(props) => <Faculty {...props} />}
              />


            </ToastProvider>
          </Switch>
        </div>
      </Router>
      {currentLocation === "/login" ||
        currentLocation === "/unauthorized" ? null : (
          <NavBar />
        )}
      {currentLocation === "/login" ||
        currentLocation === "/unauthorized" ? null : (
          <SideBar />
        )}
    </div>
  );
}

export default App;