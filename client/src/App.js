import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//Import the styles
import 'bootstrap/dist/css/bootstrap.min.css';
// import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import 'react-pro-sidebar/dist/scss/styles.scss';
import './styles/home.scss'
import './styles/NavBar.scss';
import './styles/SideBar.scss';


//Import the pages
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';

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
            {/* <Route
              exact
              path="/login"
              render={(props) => <Login {...props} />}
            /> */}
            {/* 
            <Route exact path="/home" render={(props) => <Home {...props} />} />

            <Route exact path="/" render={(props) => <Home {...props} />} /> */}
            {/* <Route exact path="/" render={(props) => <NavBar {...props} />} /> */}
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