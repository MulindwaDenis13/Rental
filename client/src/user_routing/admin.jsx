import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "../App.css";
import "line-awesome/dist/line-awesome/css/line-awesome.css";

import Dashboard from "../Routes/admin/dashboard";
import Tenant from "../Routes/admin/tenant";
import Room from "../Routes/admin/room";
import RoomAllocation from "../Routes/admin/roomAllocation";
import Payment from "../Routes/admin/payment";
import Error from "../components/404";

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
            <Route path="/new-payment" exact component={Payment} />
            <Route
              path="/new-room-allocation"
              exact
              component={RoomAllocation}
            />
            <Route path="*" exact component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default Admin;
