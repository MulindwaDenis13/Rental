import React, { Component } from "react";
import Nav from "./components/nav";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Helper from "../../components/format";
import Api from "../../api/users";

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalIncome: 0,
      todayPayments: 0,
      monthPayments: 0,
      annualPayments: 0,
    };
    this.fetchPayments();
  }

  async fetchPayments() {
    let result = (await Api.data("/payments")) || [];
    let todayPayments = 0;
    let monthPayments = 0;
    let annualPayments = 0;
    let total = 0;

    let today =
      new Date(Date.now()).getDate() +
      "-" +
      (new Date(Date.now()).getMonth() + 1) +
      "-" +
      new Date(Date.now()).getFullYear();

    let month =
      new Date(Date.now()).getMonth() +
      1 +
      "-" +
      new Date(Date.now()).getFullYear();

    let year = new Date(Date.now()).getFullYear();

    if (result !== "Error") {
      result.forEach((i) => {
        total += i.payment_fee;
        let paymentDate =
          new Date(parseInt(i.payment_date)).getDate() +
          "-" +
          (new Date(parseInt(i.payment_date)).getMonth() + 1) +
          "-" +
          new Date(parseInt(i.payment_date)).getFullYear();

        let paymentMonth =
          new Date(parseInt(i.payment_date)).getMonth() +
          1 +
          "-" +
          new Date(parseInt(i.payment_date)).getFullYear();

        let paymentYear = new Date(parseInt(i.payment_date)).getFullYear();

        if (today === paymentDate) {
          todayPayments += i.payment_fee;
        }
        if (month === paymentMonth) {
          monthPayments += i.payment_fee;
        }
        if (year === paymentYear) {
          annualPayments += i.payment_fee;
        }
      });
      this.setState({
        ...this.state,
        totalIncome: total,
        todayPayments: todayPayments,
        monthPayments: monthPayments,
        annualPayments: annualPayments,
      });
    }
  }
  render() {
    return (
      <>
        <input type="checkbox" id="nav-toggle" defaultChecked />
        <Nav active="payments" />
        <div className="main-content">
          <Header />
          <main>
            <div className="cards">
              <div className="card-single">
                <div className="">
                  <h4>UGX {Helper.format(this.state.todayPayments)}</h4>
                  <span>
                    Total Income <br />
                    <span style={{ fontSize: "13px" }}>
                      Today:{" "}
                      {new Date(Date.now()).getDate() +
                        "-" +
                        (new Date(Date.now()).getMonth() + 1) +
                        "-" +
                        new Date(Date.now()).getFullYear()}
                    </span>
                  </span>
                </div>
                <div className="">
                  <span className="las la-dollar-sign"> </span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h4>UGX {Helper.format(this.state.monthPayments)}</h4>
                  <span>
                    Total Income <br />
                    <span style={{ fontSize: "13px" }}>
                      This Month:{" "}
                      {new Date(Date.now()).getMonth() +
                        1 +
                        "-" +
                        new Date(Date.now()).getFullYear()}
                    </span>
                  </span>
                </div>
                <div className="">
                  <span className="las la-dollar-sign"></span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h4>UGX {Helper.format(this.state.annualPayments)}</h4>
                  <span>Total Income</span> <br />
                  <span style={{ fontSize: "13px" }}>
                    This Year: {new Date(Date.now()).getFullYear()}
                  </span>
                </div>
                <div className="">
                  <span className="las la-dollar-sign"> </span>
                </div>
              </div>
              <div className="card-single">
                <div className="">
                  <h4>UGX {Helper.format(this.state.totalIncome)}</h4>
                  <span>Total Income</span>
                </div>
                <div className="">
                  <span className="las la-dollar-sign"> </span>
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

export default Payments;
