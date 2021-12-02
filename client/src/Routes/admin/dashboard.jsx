import React, { Component } from "react";
import { Button, Menu, MenuItem } from "@material-ui/core";
import Nav from "./components/nav";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AnchorEl: null,
      AnchorElRooms: null,
      open: false,
      message: "",
      messageState: "",
    };
  }

  handleOpenActions = (e) => {
    this.setState({ ...this.state, AnchorEl: e.currentTarget });
  };
  handleCloseActions = () => {
    this.setState({ ...this.state, AnchorEl: null });
  };
  handleOpenActionsRooms = (e) => {
    this.setState({ ...this.state, AnchorElRooms: e.currentTarget });
  };
  handleCloseActionsRooms = () => {
    this.setState({ ...this.state, AnchorElRooms: null });
  };

  render() {
    return (
      <>
        <input type="checkbox" id="nav-toggle" defaultChecked />
        <Nav active="dashboard" />
        <div className="main-content">
          <Header />
          <main>
            <div className="cards">
              <div className="card-single">
                <div className="">
                  <h3>20</h3>
                  <span>
                    Total Rooms <br />
                  </span>
                </div>
                <div className="">
                  <span className="las la-users"> </span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h3>5</h3>
                  <span>Free Rooms</span>
                </div>
                <div className="">
                  <span className="las la-medkit"></span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h3>15</h3>
                  <span>Occupied Rooms</span>
                </div>
                <div className="">
                  <span className="las la-users"> </span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h3>12</h3>
                  <span>Tenants</span>
                </div>
                <div className="">
                  <span className="las la-users"> </span>
                </div>
              </div>
            </div>
            <div className="recent-grid">
              <div className="projects">
                <div className="card">
                  <div className="card-header">
                    <h3>Recent Added Rooms</h3>
                    <Button
                      variant="contained"
                      color="primary"
                      aria-controls="room-actions"
                      aria-haspopup="true"
                      onClick={this.handleOpenActionsRooms}
                    >
                      Menu
                      <span style={{ fontSize: "17.5px", marginLeft: "10px" }}>
                        <span className="las la-angle-down"></span>
                      </span>
                    </Button>
                    <Menu
                      id="room-actions"
                      anchorEl={this.state.AnchorElRooms}
                      keepMounted
                      open={Boolean(this.state.AnchorElRooms)}
                      onClose={this.handleCloseActionsRooms}
                      disableScrollLock={true}
                    >
                      <Link to="/new-room">
                        <MenuItem onClick={this.handleCloseActionsRooms}>
                          New Room
                        </MenuItem>
                      </Link>
                      <Link to="/new-room-allocation">
                        <MenuItem onClick={this.handleCloseActionsRooms}>
                          New Allocation
                        </MenuItem>
                      </Link>
                    </Menu>
                  </div>
                  <div className="card-body"></div>
                </div>
              </div>
              <div className="projects">
                <div className="card">
                  <div className="card-header">
                    <h3>Recent Added Tenants</h3>
                    <Button
                      variant="contained"
                      color="primary"
                      aria-controls="tenant-actions"
                      aria-haspopup="true"
                      onClick={this.handleOpenActions}
                    >
                      Menu
                      <span style={{ fontSize: "17.5px", marginLeft: "10px" }}>
                        <span className="las la-angle-down"></span>
                      </span>
                    </Button>
                    <Menu
                      id="tenant-actions"
                      anchorEl={this.state.AnchorEl}
                      keepMounted
                      open={Boolean(this.state.AnchorEl)}
                      onClose={this.handleCloseActions}
                      disableScrollLock={true}
                    >
                      <Link to="/new-tenant">
                        <MenuItem onClick={this.handleCloseActions}>
                          New Tenant
                        </MenuItem>
                      </Link>
                      <Link to="/new-payment">
                        <MenuItem onClick={this.handleCloseActions}>
                          New Payment
                        </MenuItem>
                      </Link>
                    </Menu>
                  </div>
                  <div className="card-body"></div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }
}

export default Dashboard;