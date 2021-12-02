import React, { Component } from "react";
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
import Nav from "./components/nav";
import Header from "../../components/header";
import Footer from "../../components/footer";
import MuiAlert from "@material-ui/lab/Alert";
import Api from "../../api/users";
import "../../design/forms.css";
import "../../design/main.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      message: "",
      messageState: "",
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

  handleRoom = async (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      open: true,
      messageState: "info",
      message: "Please Wait...",
    });
    const fd = new FormData(e.target);
    let form_content = {};
    fd.forEach((value, key) => {
      form_content[key] = value;
    });
    const api = new Api();
    let result = await api.post("/new-room", form_content);
    if (result !== "Error") {
      if (result.status === true) {
        this.setState({
          ...this.state,
          messageState: "success",
          message: result.data,
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        this.setState({
          ...this.state,
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
        <Nav active="rooms" />
        <div className="main-content">
          <Header />
          <main>
            <div className="fullwidth-ctr">
              <div className="projects">
                <form
                  className="card"
                  autoComplete="off"
                  onSubmit={this.handleRoom}
                >
                  <div
                    className=""
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      padding: "1rem",
                    }}
                  >
                    <div className="form-header-ctr">
                      <div className="">
                        <h3>New Room</h3>
                      </div>
                      <div className="">
                        <Button
                          aria-describedby={this.id}
                          variant="contained"
                          color="primary"
                          style={{ marginInline: 10 }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          aria-describedby={this.id}
                          variant="contained"
                          color="primary"
                          style={{ marginInline: 10 }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div>
                      <div className="inputCtr">
                        <h4>Room Details</h4>
                        <div className="inputs_ctr">
                          <div className="inpts_on_left">
                            <TextField
                              name="number"
                              variant="outlined"
                              label="Room Number"
                              style={{
                                width: "75%",
                                margin: "20px",
                              }}
                            />
                          </div>
                          <div className="inpts_center">
                            <TextField
                              type="number"
                              name="fee"
                              variant="outlined"
                              label="Fee(UGX) Monthly"
                              style={{
                                width: "75%",
                                margin: "20px",
                              }}
                            />
                          </div>
                          <div className="inpts_on_right">
                            <FormControl
                              variant="outlined"
                              label="Type"
                              style={{
                                width: "80%",
                                margin: "20px",
                              }}
                            >
                              <InputLabel id="type">RoomType</InputLabel>
                              <Select
                                inputProps={{ name: "type" }}
                                id="select_room_type"
                                label="Type"
                                defaultValue="single"
                              >
                                <MenuItem value="single">Single</MenuItem>
                                <MenuItem value="double">Double</MenuItem>
                              </Select>
                            </FormControl>
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

export default Room;
