import React, { Component } from "react";
import {
  IconButton,
  Snackbar,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import Nav from "./components/nav";
import Header from "../../components/header";
import Footer from "../../components/footer";
import MuiAlert from "@material-ui/lab/Alert";
import { Link } from "react-router-dom";
import Api from "../../api/users";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AnchorEl: null,
      AnchorElRooms: null,
      open: false,
      dialog: false,
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

  closePopUp = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      ...this.state,
      open: false,
      message: "Please Wait...",
      messageState: "info",
    });
  };

  handleClose = () => {
    this.setState({ ...this.state, dialog: false });
  };

  handleUser = async (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      open: true,
      messageState: "info",
      message: "Please Wait...",
    });
    const fd = new FormData(e.target);
    let _fcontent = {};
    fd.forEach((value, key) => {
      _fcontent[key] = value;
    });
    const api = new Api();
    const result = await api.post("/new-user", _fcontent);
    if (result !== "Error") {
      if (result.status === true) {
        this.setState({
          ...this.state,
          message: result.data,
          messageState: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        this.setState({
          ...this.state,
          message: result.data,
          messageState: "error",
        });
      }
    }
  };

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
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={this.state.open}
          autoHideDuration={5000}
          onClose={this.closePopUp}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.closePopUp}
              >
                <i className="las la-times"></i>
              </IconButton>
            </React.Fragment>
          }
        >
          <Alert onClose={this.closePopUp} severity={this.state.messageState}>
            {this.state.message}
          </Alert>
        </Snackbar>
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
                            <td>No Room</td>
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
                      <MenuItem
                        onClick={() => {
                          this.setState({ ...this.state, dialog: true });
                        }}
                      >
                        New User
                      </MenuItem>
                    </Menu>
                  </div>
                  <div className="card-body">
                    <table width="100%">
                      <thead>
                        <tr>
                          <td>Firstname</td>
                          <td>Lastname</td>
                          <td>Address</td>
                          <td>Contact</td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.tenants.length === 0 ? (
                          <tr>
                            <td>No Tenant</td>
                          </tr>
                        ) : this.state.tenants.length >= 5 ? (
                          this.state.tenants
                            .slice(
                              this.state.tenants.length - 5,
                              this.state.tenants.length
                            )
                            .map((x, y) => {
                              return (
                                <tr key={y}>
                                  <td>{x.tenant_first_name}</td>
                                  <td>{x.tenant_last_name}</td>
                                  <td>{x.tenant_address}</td>
                                  <td>{x.tenant_contact}</td>
                                </tr>
                              );
                            })
                        ) : (
                          this.state.tenants.map((v, i) => {
                            return (
                              <tr key={i}>
                                <td>{v.tenant_first_name}</td>
                                <td>{v.tenant_last_name}</td>
                                <td>{v.tenant_address}</td>
                                <td>{v.tenant_contact}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>

        <Dialog
          open={this.state.dialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add User</DialogTitle>
          <form autoComplete="off" onSubmit={this.handleUser}>
            <DialogContent>
              <DialogContentText>
                <TextField
                  name="username"
                  variant="standard"
                  label="Username"
                  style={{
                    width: "85%",
                    margin: "20px",
                  }}
                />
                <TextField
                  name="phonenumber"
                  variant="standard"
                  label="Contact"
                  style={{
                    width: "85%",
                    margin: "20px",
                  }}
                />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </>
    );
  }
}

export default Dashboard;
