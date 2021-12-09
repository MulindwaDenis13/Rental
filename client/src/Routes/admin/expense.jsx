import React, { Component } from "react";
import Header from "../../components/header";
import Nav from "./components/nav";
import Footer from "../../components/footer";
import MuiAlert from "@material-ui/lab/Alert";
import {
  TextField,
  Snackbar,
  Button,
  IconButton,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Api from "../../api/users";

import "../../design/main.css";
import "../../design/forms.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Expense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      message: "",
      messageState: "",
      active_tenant: {},
      active_room: {},
      tenants: [],
      tenant_rooms: [],
      formData: [],
    };
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

  handleChange = async (e, v) => {
    await this.setState({ ...this.state, active_tenant: v });
    let result = await Api.data(`/tenant-rooms/${v.tenant_id}`);
    this.setState({
      ...this.state,
      tenant_rooms: result === "Error" ? [] : result,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      open: true,
      message: "Please Wait...",
      messageState: "info",
    });
    let content = {};
    const fd = new FormData(e.target);
    fd.forEach((value, key) => {
      content[key] = value;
    });
    content["tenant"] = this.state.active_tenant.tenant_first_name;

    let room_no = this.state.formData.find((i) => i.room_no === content.room);
    if (!room_no) {
      this.setState({
        ...this.state,
        open: true,
        message: "Expense Added",
        messageState: "success",
        formData: [...this.state.formData, content],
      });
    } else {
      this.setState({
        ...this.state,
        open: true,
        message: "Expense Exists",
        messageState: "warning",
      });
    }
  };

  handleExpense = async () => {
    let data = {};
    data["tenant"] = this.state.active_tenant.tenant_id;
    data["room"] = this.state.active_room.room_id;
    data["content"] = this.state.formData;
    data["date"] = Date.now();
    const api = new Api();
    let result = await api.post("/new-expense", data);
    if (result !== "Error") {
      if (result.status) {
        this.setState({
          ...this.state,
          open: true,
          messageState: "success",
          message: result.data,
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        this.setState({
          ...this.state,
          open: true,
          messageState: "error",
          message: result.data,
        });
      }
    }
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
        <Nav active="expenses" />
        <div className="main-content">
          <Header />
          <main>
            <div className="recent-grid-left">
              <div className="card">
                <div className="card-header">
                  <h3>Expense List</h3>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: 10 }}
                    onClick={this.handleExpense}
                  >
                    <span style={{ fontSize: "17.5px", marginRight: "10px" }}>
                      <i className="las la-save"></i>
                    </span>
                    Save
                  </Button>
                </div>
                <div className="card-body tbl_ctr">
                  <table width="100%">
                    <thead>
                      <tr>
                        <td>Expense</td>
                        <td>Amount(UGX)</td>
                        <td>Room</td>
                        <td>Tenant</td>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.formData.length === 0 ? (
                        <tr>
                          <td>No Expense Added</td>
                        </tr>
                      ) : (
                        this.state.formData.map((v, i) => {
                          return (
                            <tr key={i}>
                              <td className="name_cell">{v.name}</td>
                              <td>{v.amount}</td>
                              <td>{v.room}</td>
                              <td>{v.tenant}</td>
                              <td>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    let arr = this.state.formData;
                                    arr.splice(i, 1);
                                    this.setState({
                                      ...this.state,
                                      formData: arr,
                                    });
                                  }}
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="projects">
                <form
                  className="card"
                  autoComplete="off"
                  onSubmit={this.handleSubmit}
                >
                  <div className="card-header card-header-payments">
                    <h3 className="class_payment_header">New Expense</h3>
                    <div className="">
                      <Button
                        type="submit"
                        aria-describedby={this.id}
                        variant="contained"
                        color="primary"
                      >
                        <span
                          style={{ fontSize: "17.5px", marginRight: "10px" }}
                        >
                          <i className="las la-plus-circle"></i>
                        </span>
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div>
                      <div className="inputCtr">
                        <h4>Expense Details</h4>
                        <div className="inputs_ctr">
                          <div className="inpts_on_left">
                            <Autocomplete
                              id="combo-box-demo"
                              options={this.state.tenants}
                              getOptionLabel={(option) =>
                                `${option.tenant_first_name} ${option.tenant_last_name}`
                              }
                              onChange={this.handleChange}
                              onKeyUp={async (e) => {
                                let res = await Api.data(
                                  `/search-tenant/${e.target.value}`
                                );
                                this.setState({
                                  ...this.state,
                                  tenants: res === "Error" ? [] : res,
                                });
                              }}
                              style={{
                                width: "85%",
                                margin: "20px",
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Search Tenant"
                                  name="room"
                                  variant="outlined"
                                  error={this.state.error}
                                />
                              )}
                            />
                            <FormControl
                              variant="outlined"
                              label="room"
                              style={{
                                width: "80%",
                                margin: "20px",
                              }}
                            >
                              <InputLabel id="room">Room</InputLabel>
                              <Select
                                inputProps={{ name: "room" }}
                                id="select_room"
                                label="Room"
                                defaultValue=""
                                onChange={(e, v) => {
                                  let selectedRoom =
                                    this.state.tenant_rooms.find(
                                      (i) => i.room_no === e.target.value
                                    );
                                  this.setState({
                                    ...this.state,
                                    active_room: selectedRoom,
                                  });
                                }}
                              >
                                {this.state.tenant_rooms.length === 0
                                  ? "No Room for this Tenant"
                                  : this.state.tenant_rooms.map((v, i) => {
                                      return (
                                        <MenuItem value={v.room_no} key={i}>
                                          {v.room_no}
                                        </MenuItem>
                                      );
                                    })}
                              </Select>
                            </FormControl>
                            <TextField
                              name="name"
                              variant="outlined"
                              label="Expense for"
                              style={{
                                width: "75%",
                                margin: "20px",
                              }}
                            />
                            <TextField
                              name="amount"
                              variant="outlined"
                              label="Amount(UGX)"
                              style={{
                                width: "75%",
                                margin: "20px",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }
}

export default Expense;
