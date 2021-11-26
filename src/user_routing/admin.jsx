import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "../App.css";
import "line-awesome/dist/line-awesome/css/line-awesome.css";

import Dashboard from "../Routes/admin/dashboard";
import Tenant from "../Routes/admin/tenant";
import Room from "../Routes/admin/room";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/new-room" exact component={Room} />
            <Route path="/new-tenant" exact component={Tenant} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default Admin;
