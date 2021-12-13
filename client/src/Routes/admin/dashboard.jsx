import React, { Component } from "react";
import { Button, Menu, MenuItem } from "@material-ui/core";
import Nav from "./components/nav";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";
import Api from "../../api/users";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AnchorEl: null,
      AnchorElRooms: null,
      open: false,
      message: "",
      messageState: "",
      tenants: [],
      rooms: [],
      free: 0,
      booked: 0,
    };
    this.fetchRooms();
    this.fetchTenants();
  }

  async fetchRooms() {
    let result = (await Api.data("/rooms")) || [];
    let free = 0;
    let booked = 0;
    if (result !== "Error") {
      result.forEach((i) => {
        i.room_status === "Free" ? free++ : booked++;
      });
      this.setState({
        ...this.state,
        rooms: result,
        free: free,
        booked: booked,
      });
    } else {
      this.setState({
        ...this.state,
        rooms: [],
        free: free,
        booked: booked,
      });
    }
  }

  async fetchTenants() {
    let result = (await Api.data("/tenants")) || [];
    this.setState({ ...this.state, tenants: result === "Error" ? [] : result });
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
                  <h3>{this.state.rooms.length}</h3>
                  <span>
                    Total Rooms <br />
                  </span>
                </div>
                <div className="">
                  <span className="las la-bed"> </span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h3>{this.state.free}</h3>
                  <span>Free Rooms</span>
                </div>
                <div className="">
                  <span className="las la-bed"></span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h3>{this.state.booked}</h3>
                  <span>Occupied Rooms</span>
                </div>
                <div className="">
                  <span className="las la-bed"> </span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h3>{this.state.tenants.length}</h3>
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
                  <div className="card-body">
                    <table width="100%">
                      <thead>
                        <tr>
                          <td>Number</td>
                          <td>Room Fee(UGX)</td>
                          <td>Room Type</td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.rooms.length === 0 ? (
                          <tr>
                            <td>No Free Room</td>
                          </tr>
                        ) : this.state.rooms.length >= 5 ? (
                          this.state.rooms
                            .slice(
                              this.state.rooms.length - 5,
                              this.state.rooms.length
                            )
                            .map((x, y) => {
                              return (
                                <tr key={y}>
                                  <td>{x.room_no}</td>
                                  <td>{x.room_fee}</td>
                                  <td>{x.room_type}</td>
                                </tr>
                              );
                            })
                        ) : (
                          this.state.rooms.map((v, i) => {
                            return (
                              <tr key={i}>
                                <td>{v.room_no}</td>
                                <td>{v.room_fee}</td>
                                <td>{v.room_type}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
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
                      <Link to="/new-expense">
                        <MenuItem onClick={this.handleCloseActions}>
                          New Expense
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
