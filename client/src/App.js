import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./App.css";
import MainLayouts from "./layouts/MainLayouts";
import Reset from "./routes/Reset";
import Login from "./routes/Login";
import Register from "./routes/Register";

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path={"/reg"} component={Register} />
          <Route path={"/login"} component={Login} />
          <Route path={"/reset"} component={Reset} />
          <Route path={"/index"}>
            <MainLayouts />
          </Route>
          <Redirect from="/" to={"/login"} />
        </Switch>
      </Router>
    );
  }
}
