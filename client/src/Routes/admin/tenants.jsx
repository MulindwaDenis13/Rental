import React, { Component } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Nav from "./components/nav";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Api from "../../api/users";

class Tenants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      expense: false,
      tenants: [],
      payments: [],
      expenses: [],
    };
  }

  CloseDialog = () => {
    this.setState({ ...this.state, open: false });
  };

  CloseExpenseDialog = () => {
    this.setState({ ...this.state, expense: false });
  };

  render() {
    return (
      <>
        <input type="checkbox" id="nav-toggle" defaultChecked />
        <Nav active="tenants" />
        <div className="main-content">
          <Header />
          <main>
            <div className="fullwidth-ctr">
              <div className="projects">
                <div className="card">
                  <div className="card-header">
                    <h3>Registered Tenants</h3>
                    <TextField
                      name="name"
                      variant="outlined"
                      label="Search Tenant"
                      style={{
                        width: "15%",
                      }}
                      onKeyUp={async (e) => {
                        let res = await Api.data(
                          `/search-tenant/${e.target.value}`
                        );
                        this.setState({
                          ...this.state,
                          tenants: res === "Error" ? [] : res,
                        });
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <table width="100%">
                      <thead>
                        <tr>
                          <td>Firstname</td>
                          <td>Lastname</td>
                          <td>Address</td>
                          <td>Contact</td>
                          <td>Payments</td>
                          <td>Expenses</td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.tenants.length === 0 ? (
                          <tr>
                            <td>Search Tenant</td>
                          </tr>
                        ) : (
                          this.state.tenants.map((v, i) => {
                            return (
                              <tr key={i}>
                                <td>{v.tenant_first_name}</td>
                                <td>{v.tenant_last_name}</td>
                                <td>{v.tenant_address}</td>
                                <td>{v.tenant_contact}</td>
                                <td>
                                  <Button
                                    type="submit"
                                    aria-describedby={this.id}
                                    variant="contained"
                                    color="primary"
                                    style={{ marginInline: 10 }}
                                    onClick={async () => {
                                      let result =
                                        (await Api.data(
                                          `/tenant-payments/${v.tenant_id}`
                                        )) || [];
                                      this.setState({
                                        ...this.state,
                                        payments:
                                          result === "Error" ? [] : result,
                                        open: true,
                                      });
                                    }}
                                  >
                                    See All
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    type="submit"
                                    aria-describedby={this.id}
                                    variant="contained"
                                    color="primary"
                                    style={{ marginInline: 10 }}
                                    onClick={async () => {
                                      let result =
                                        (await Api.data(
                                          `/tenant-expenses/${v.tenant_id}`
                                        )) || [];
                                      this.setState({
                                        ...this.state,
                                        expenses:
                                          result === "Error" ? [] : result,
                                        expense: true,
                                      });
                                    }}
                                  >
                                    See All
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
              </div>
            </div>
          </main>
          <Footer />
        </div>
        <Dialog
          open={this.state.open}
          onClose={this.CloseDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Tenant Payments</DialogTitle>

          <DialogContent>
            <DialogContentText>
              <h5>Past Payments</h5>
              <table>
                <thead>
                  <tr>
                    <td>Room</td>
                    <td>Amount</td>
                    <td>Period</td>
                    <td>Date</td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.payments.length === 0 ? (
                    <tr>
                      <td>No Payment</td>
                    </tr>
                  ) : (
                    this.state.payments.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td>{v.room_no}</td>
                          <td>{v.payment_fee}</td>
                          <td>{v.payment_duration}</td>
                          <td>
                            {new Date(parseInt(v.payment_date)).getDate() +
                              "-" +
                              (new Date(parseInt(v.payment_date)).getMonth() +
                                1) +
                              "-" +
                              new Date(parseInt(v.payment_date)).getFullYear()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              <table>
                <thead>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>NextPaymentDate</td>
                    <td>24-12-2021</td>
                  </tr>
                </thead>
              </table>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.CloseDialog}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.expense}
          onClose={this.CloseExpenseDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Tenant Expenses</DialogTitle>

          <DialogContent>
            <DialogContentText>
              <h5>Past Expenses</h5>
              <table>
                <thead>
                  <tr>
                    <td>Room</td>
                    <td>Amount</td>
                    <td>For</td>
                    <td>Date</td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.expenses.length === 0 ? (
                    <tr>
                      <td>No Expense</td>
                    </tr>
                  ) : (
                    this.state.expenses.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td>{v.room_no}</td>
                          <td>{v.expense_amount}</td>
                          <td>{v.expense_for}</td>
                          <td>
                            {new Date(parseInt(v.expense_date)).getDate() +
                              "-" +
                              (new Date(parseInt(v.expense_date)).getMonth() +
                                1) +
                              "-" +
                              new Date(parseInt(v.expense_date)).getFullYear()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.CloseExpenseDialog}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default Tenants;
