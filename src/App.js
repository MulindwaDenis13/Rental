import React, { Component } from "react";
import Admin from "./user_routing/admin";
import Login from "./components/login";
import user from "./config";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    if (user.user.user_id) {
      return <Admin />;
    } else {
      return <Login />;
    }
  }
}

export default App;
