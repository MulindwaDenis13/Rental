import React, { Component } from "react";
import Nav from "./components/nav";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Helper from "../../components/format";
import Api from "../../api/users";

class Expenses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalExpense: 0,
      todayExpenses: 0,
      monthExpenses: 0,
      annualExpenses: 0,
    };
    this.fetchExpenses();
  }

  async fetchExpenses() {
    let result = (await Api.data("/expenses")) || [];
    let todayExpenses = 0;
    let monthExpenses = 0;
    let annualExpenses = 0;
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
        total += i.expense_amount;
        let expenseDate =
          new Date(parseInt(i.expense_date)).getDate() +
          "-" +
          (new Date(parseInt(i.expense_date)).getMonth() + 1) +
          "-" +
          new Date(parseInt(i.expense_date)).getFullYear();

        let expenseMonth =
          new Date(parseInt(i.expense_date)).getMonth() +
          1 +
          "-" +
          new Date(parseInt(i.expense_date)).getFullYear();

        let expenseYear = new Date(parseInt(i.expense_date)).getFullYear();

        if (today === expenseDate) {
          todayExpenses += i.expense_amount;
        }
        if (month === expenseMonth) {
          monthExpenses += i.expense_amount;
        }
        if (year === expenseYear) {
          annualExpenses += i.expense_amount;
        }
      });
      this.setState({
        ...this.state,
        todayExpenses: todayExpenses,
        monthExpenses: monthExpenses,
        annualExpenses: annualExpenses,
        totalExpense: total,
      });
    }
  }

  render() {
    return (
      <>
        <input type="checkbox" id="nav-toggle" defaultChecked />
        <Nav active="expenses" />
        <div className="main-content">
          <Header />
          <main>
            <div className="cards">
              <div className="card-single">
                <div className="">
                  <h4>UGX {Helper.format(this.state.todayExpenses)}</h4>
                  <span>
                    Total Expenses <br />
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
                  <h4>UGX {Helper.format(this.state.monthExpenses)}</h4>
                  <span>
                    Total Expense <br />
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
                  <h4>UGX {Helper.format(this.state.annualExpenses)}</h4>
                  <span>Total Expense</span> <br />
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
                  <h4>UGX {Helper.format(this.state.totalExpense)}</h4>
                  <span>Total Expense</span>
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

export default Expenses;
