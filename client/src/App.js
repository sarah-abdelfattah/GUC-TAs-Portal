import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//Import the pages
import UnauthorizedPage from './pages/UnauthorizedPage';


function App() {
  // eslint-disable-next-line
  var currentLocation = window.location.pathname
  // eslint-disable-next-line
  var t = document.title = "GUC Portal"


  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            {/* <Route
              exact
              path="/login"
              render={(props) => <Login {...props} />}
            /> */}
            {/* 
            <Route exact path="/home" render={(props) => <Home {...props} />} />

            <Route exact path="/" render={(props) => <Home {...props} />} /> */}

            <Route
              path="/unauthorized"
              render={(props) => <UnauthorizedPage {...props} />}
            />
          </Switch>

        </div>
      </Router>
    </div>
  );
}

export default App;