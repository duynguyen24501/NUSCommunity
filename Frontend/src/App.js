import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./App.css";
import Reset from "./routes/Reset";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Home from "./routes/Home";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path={"/reg"} component={Register} />
        <Route path={"/login"} component={Login} />
        <Route path={"/reset"} component={Reset} />
        <Route path={"/home"} component={Home} />
        <Redirect from="/" to={"/login"} />
      </Switch>
    </Router>
  );
};

export default App;
