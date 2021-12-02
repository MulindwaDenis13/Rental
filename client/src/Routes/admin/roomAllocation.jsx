import React, { Component } from "react";
import Header from "../../components/header";
import Nav from "./components/nav";
import Footer from "../../components/footer";
import MuiAlert from "@material-ui/lab/Alert";
import Api from "../../api/users";
import { TextField, Snackbar, Button, IconButton } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import "../../design/main.css";
import "../../design/forms.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class RoomAllocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      open: false,
      message: "Please Wait...",
      messageState: "",
      empty_error: false,
      formData: [],
      tenants: [],
      rooms: [],
    };
  }

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
        <Nav active="rooms" />
        <div className="main-content">
          <Header />
          <main>
            <div className="recent-grid-left">
              <div className="card">
                <div className="card-header">
                  <h3>Room List</h3>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: 10 }}
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
                        <td>Number</td>
                        <td>Type</td>
                        <td>Fee(UGX)</td>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {this.state.formData.length === 0 ? (
                        <tr>
                          <td>No Vaccine Added</td>
                        </tr>
                      ) : (
                        this.state.formData.map((v, i) => {
                          return (
                            <tr key={i}>
                              <td className="name_cell">{v.vaccine_name}</td>
                              <td>{v.sight_of_vaccination}</td>
                              <td>{v.disease_prevented}</td>
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
                      )} */}
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
                    <h3 className="class_payment_header">
                      New Room Allocation
                    </h3>
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
                        <h4>Room Details</h4>
                        <div className="inputs_ctr">
                          <div className="inpts_on_left">
                            <Autocomplete
                              id="combo-box-demo"
                              options={this.state.tenants}
                              getOptionLabel={(option) =>
                                `${option.tenant_first_name} ${option.tenant_last_name}`
                              }
                              // onChange={this.handleChangeVaccineName}
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
                            <Autocomplete
                              id="combo-box-demo"
                              options={this.state.rooms}
                              getOptionLabel={(option) =>
                                `${option.room_no} - ${option.room_fee}UGX`
                              }
                              // onChange={this.handleChangeVaccineName}
                              onKeyUp={async (e) => {
                                let res = await Api.data(
                                  `/search-room/${e.target.value}`
                                );
                                this.setState({
                                  ...this.state,
                                  rooms: res === "Error" ? [] : res,
                                });
                              }}
                              style={{
                                width: "85%",
                                margin: "20px",
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Search Room"
                                  name="room"
                                  variant="outlined"
                                  error={this.state.error}
                                  //   onChange={(e) => {
                                  //     this.setState({
                                  //       ...this.state,
                                  //       required: {
                                  //         ...this.state.required,
                                  //         vaccine_name: e.target.value,
                                  //       },
                                  //     });
                                  //   }}
                                />
                              )}
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

export default RoomAllocation;
