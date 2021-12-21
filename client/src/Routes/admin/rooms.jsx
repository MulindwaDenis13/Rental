import React, { Component } from "react";
import Nav from "./components/nav";
import { TextField } from "@material-ui/core";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Api from "../../api/users";

class Rooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      free: [],
      booked: [],
    };
    this.fetchBookedRooms();
    this.fetchFreeRooms();
  }

  async fetchFreeRooms() {
    let result = (await Api.data("/rooms")) || [];
    let free = [];
    if (result !== "Error") {
      result.forEach((i) => {
        if (i.room_status === "Free") {
          free.push(i);
        }
      });
      this.setState({
        ...this.state,
        free: free,
      });
    } else {
      this.setState({
        ...this.state,
        free: free,
      });
    }
  }

  async fetchBookedRooms() {
    let result = (await Api.data("/booked-rooms")) || [];
    let booked = [];
    if (result !== "Error") {
      result.forEach((i) => {
        booked.push(i);
      });
      this.setState({
        ...this.state,
        booked: booked,
      });
    } else {
      this.setState({
        ...this.state,
        booked: booked,
      });
    }
  }

  render() {
    return (
      <>
        <input type="checkbox" id="nav-toggle" defaultChecked />
        <Nav active="rooms" />
        <div className="main-content">
          <Header />
          <main>
            <div className="recent-grid">
              <div className="projects">
                <div className="card">
                  <div className="card-header">
                    <h3>Free Rooms</h3>
                    <TextField
                      name="number"
                      variant="outlined"
                      label="Room Number"
                      style={{
                        width: "50%",
                      }}
                      onKeyUp={async (e) => {
                        let room = this.state.free.find(
                          (i) => i.room_no === e.target.value
                        );
                        if (!room) {
                          this.setState({ ...this.state });
                        } else {
                          let search = [];
                          search.push(room);
                          this.setState({ ...this.state, free: search });
                        }
                      }}
                    />
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
                        {this.state.free.length === 0 ? (
                          <tr>
                            <td>No Free Room</td>
                          </tr>
                        ) : this.state.free.length >= 5 ? (
                          this.state.free
                            .slice(
                              this.state.free.length - 5,
                              this.state.free.length
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
                          this.state.free.map((v, i) => {
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
                    <h3>Booked Rooms</h3>
                    <TextField
                      name="number"
                      variant="outlined"
                      label="Room Number"
                      style={{
                        width: "50%",
                      }}
                      onKeyUp={async (e) => {
                        let room = this.state.booked.find(
                          (i) => i.room_no === e.target.value
                        );
                        if (!room) {
                          this.setState({ ...this.state });
                        } else {
                          let search = [];
                          search.push(room);
                          this.setState({ ...this.state, booked: search });
                        }
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <table width="100%">
                      <thead>
                        <tr>
                          <td>Number</td>
                          <td>Room Fee(UGX)</td>
                          <td>Room Type</td>
                          <td>Booked By</td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.booked.length === 0 ? (
                          <tr>
                            <td>No Booked Room</td>
                          </tr>
                        ) : this.state.booked.length >= 5 ? (
                          this.state.booked
                            .slice(
                              this.state.booked.length - 5,
                              this.state.booked.length
                            )
                            .map((x, y) => {
                              return (
                                <tr key={y}>
                                  <td>{x.room_no}</td>
                                  <td>{x.room_fee}</td>
                                  <td>{x.room_type}</td>
                                  <td>{x.tenant_first_name}</td>
                                </tr>
                              );
                            })
                        ) : (
                          this.state.booked.map((v, i) => {
                            return (
                              <tr key={i}>
                                <td>{v.room_no}</td>
                                <td>{v.room_fee}</td>
                                <td>{v.room_type}</td>
                                <td>{v.tenant_first_name}</td>
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
      </>
    );
  }
}

export default Rooms;
