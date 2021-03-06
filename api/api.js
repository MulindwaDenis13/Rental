const router = require("express").Router();
const conn = require("../database/db");

//login user
router.post("/login", async (req, res) => {
  conn.query(
    `SELECT * FROM users_tbl WHERE user_name = ? AND password = ?`,
    [req.body.username, req.body.password],
    (first_err, first_res) => {
      if (first_err) {
        console.log(first_err);
        res.send({ data: "An Error Occured", status: false });
      } else {
        first_res.length === 0
          ? res.send({ status: false })
          : res.send({ status: true, user: first_res[0] });
      }
    }
  );
});

//add user
router.post("/new-user", async (req, res) => {
  conn.query(
    `SELECT * FROM users_tbl WHERE user_name = ?`,
    req.body.username,
    (first_err, first_res) => {
      if (first_err) {
        console.log(first_err);
        res.send({ data: "An Error Occured", status: false });
      } else {
        first_res.length > 0
          ? res.send({
              data: `Username  ${req.body.username} exists`,
              status: false,
            })
          : conn.query(
              `INSERT INTO users_tbl SET ?`,
              {
                user_name: req.body.username,
                phone: req.body.phonenumber,
                password: "admin",
              },
              (insert_err, insert_res) => {
                if (insert_err) {
                  console.log(insert_err);
                  res.send({
                    data: "User not added. Try Again",
                    status: false,
                  });
                } else {
                  res.send({ data: "Room Added Successfully", status: true });
                }
              }
            );
      }
    }
  );
});

//add room
router.post("/new-room", async (req, res) => {
  let { number, fee, type } = req.body;
  conn.query(
    `SELECT * FROM rooms_tbl WHERE room_no = ?`,
    number,
    (first_err, first_res) => {
      if (first_err) {
        console.log(first_err);
        res.send({ data: "An Error Occured", status: false });
      } else {
        first_res.length > 0
          ? res.send({
              data: `Room with Number ${number} exists`,
              status: false,
            })
          : conn.query(
              `INSERT INTO rooms_tbl SET ?`,
              {
                room_no: number,
                room_type: type,
                room_fee: fee,
                room_status: "Free",
              },
              (insert_err, insert_res) => {
                if (insert_err) {
                  console.log(insert_err);
                  res.send({
                    data: "Room not added. Try Again",
                    status: false,
                  });
                } else {
                  res.send({ data: "Room Added Successfully", status: true });
                }
              }
            );
      }
    }
  );
});

//add tenant
router.post("/new-tenant", async (req, res) => {
  let { first_name, last_name, contact, address } = req.body;
  conn.query(
    `SELECT * FROM tenants_tbl WHERE tenant_contact = ?`,
    contact,
    (tenant_err, tenant_res) => {
      if (tenant_err) {
        console.log(tenant_err);
        res.send({ data: "An Error Occured. Tenant not added", status: false });
      } else {
        tenant_res.length > 0
          ? res.send({
              data: `Tenant with Phonenumber ${contact} exists`,
              status: false,
            })
          : conn.query(
              `INSERT INTO tenants_tbl SET ?`,
              {
                tenant_first_name: first_name,
                tenant_last_name: last_name,
                tenant_contact: contact,
                tenant_address: address,
              },
              (insert_err, insert_res) => {
                if (insert_err) {
                  console.log(insert_err);
                  res.send({
                    data: "Tenant not added. Try Again",
                    status: false,
                  });
                } else {
                  res.send({ data: "Tenant Added Successfully", status: true });
                }
              }
            );
      }
    }
  );
});

//allocate rooms to tenants
router.post("/new-allocation", async (req, res) => {
  let { rooms, tenant, date } = req.body;
  rooms.forEach((i) => {
    conn.query(
      `INSERT INTO tenant_room_tbl SET ?`,
      {
        tenant_id: tenant.tenant_id,
        rooms_id: i.room_id,
        allocation_date: date,
      },
      (insert_err, insert_res) => {
        if (insert_err) {
          console.log(insert_err);
          res.send({ data: "An Error Occured. Try Again", status: false });
        } else {
          conn.query(
            `UPDATE rooms_tbl SET ? WHERE room_id = ?`,
            [
              {
                room_status: "Booked",
              },
              i.room_id,
            ],
            (update_err, update_res) => {
              if (update_err) {
                console.log(update_err);
                res.send({
                  data: "An Error Occured. Try Again",
                  status: false,
                });
              }
            }
          );
        }
      }
    );
  });
  res.send({ data: "Allocation Successful", status: true });
});

//tenant new payment
router.post("/new-payment", async (req, res) => {
  req.body.data.forEach((i) => {
    conn.query(
      `INSERT INTO payments_tbl SET ?`,
      {
        tenant_id: i.tenant_id,
        room_id: i.room_id,
        payment_duration: i.period,
        payment_fee: i.paid,
        payment_date: req.body.date,
      },
      (insert_err, insert_res) => {
        if (insert_err) {
          console.log(insert_err);
          res.send({ data: "Error Occured.Try Again", status: false });
        }
      }
    );
  });
  res.send({ data: "Payment Added", status: true });
});

//new expense
router.post("/new-expense", async (req, res) => {
  let { tenant, room, date, content } = req.body;
  content.forEach((i) => {
    conn.query(
      `INSERT INTO 
    expenses_tbl SET ?`,
      {
        expense_date: date,
        tenant_id: tenant,
        room_id: room,
        expense_amount: i.amount,
        expense_for: i.name,
      },
      (insert_err, insert_res) => {
        if (insert_err) {
          console.log(insert_err);
          res.send({ data: "An Error Occured", status: false });
        }
      }
    );
  });
  res.send({ data: "Expense Added", status: true });
});

//get tenant expenses
router.get("/tenant-expenses/:id", async (req, res) => {
  conn.query(
    `SELECT * FROM expenses_tbl JOIN
     rooms_tbl ON expenses_tbl.room_id = rooms_tbl.room_id 
     WHERE tenant_id = ?`,
    req.params.id,
    (first_err, first_res) => {
      if (first_err) throw first_err;
      res.send(first_res);
    }
  );
});

//get tenant payments
router.get("/tenant-payments/:id", async (req, res) => {
  conn.query(
    `SELECT * FROM payments_tbl JOIN 
    rooms_tbl ON payments_tbl.room_id = rooms_tbl.room_id 
    WHERE tenant_id = ?`,
    req.params.id,
    (first_err, first_res) => {
      if (first_err) throw first_err;
      res.send(first_res);
    }
  );
});

//get tenant rooms
router.get("/tenant-rooms/:id", async (req, res) => {
  conn.query(
    `SELECT * FROM tenant_room_tbl 
    JOIN rooms_tbl ON 
    tenant_room_tbl.rooms_id = rooms_tbl.room_id
     WHERE tenant_room_tbl.tenant_id = ?`,
    req.params.id,
    (first_err, first_res) => {
      if (first_err) throw first_err;
      res.send(first_res);
    }
  );
});

//get booked rooms
router.get("/booked-rooms", async (req, res) => {
  conn.query(
    `SELECT * FROM rooms_tbl 
    JOIN tenant_room_tbl ON 
    rooms_tbl.room_id = tenant_room_tbl.rooms_id JOIN tenants_tbl 
    ON tenants_tbl.tenant_id = tenant_room_tbl.tenant_id`,
    (first_err, first_res) => {
      if (first_err) throw first_err;
      res.send(first_res);
    }
  );
});

//search tenant
router.get("/search-tenant/:id", async (req, res) => {
  let pattern = /\W/g;
  let check = pattern.test(req.params.id);
  if (check === true) {
    res.send([]);
    return;
  } else {
    conn.query(
      `SELECT * FROM tenants_tbl 
      WHERE tenant_first_name LIKE '%${req.params.id}%'`,
      req.params.id,
      (search_err, search_res) => {
        if (search_err) throw search_err;
        res.send(search_res);
      }
    );
  }
});

//search room
router.get("/search-room/:id", async (req, res) => {
  let pattern = /\W/g;
  let check = pattern.test(req.params.id);
  if (check === true) {
    res.send([]);
    return;
  } else {
    conn.query(
      `SELECT * FROM rooms_tbl 
      WHERE room_no LIKE '%${req.params.id}%' AND
       room_status = 'Free'`,
      req.params.id,
      (search_err, search_res) => {
        if (search_err) throw search_err;
        res.send(search_res);
      }
    );
  }
});

//get all rooms
router.get("/rooms", async (req, res) => {
  conn.query(
    `SELECT * FROM 
  rooms_tbl`,
    (first_err, first_res) => {
      if (first_err) throw first_err;
      res.send(first_res);
    }
  );
});

//get all tenants
router.get("/tenants", async (req, res) => {
  conn.query(
    `SELECT * FROM 
  tenants_tbl`,
    (first_err, first_res) => {
      if (first_err) throw first_err;
      res.send(first_res);
    }
  );
});

//get all payments
router.get("/payments", async (req, res) => {
  conn.query(
    `SELECT * FROM 
  payments_tbl`,
    (first_err, first_res) => {
      if (first_err) throw first_err;
      res.send(first_res);
    }
  );
});

//get all expenses
router.get("/expenses", async (req, res) => {
  conn.query(
    `SELECT * FROM 
  expenses_tbl`,
    (first_err, first_res) => {
      if (first_err) throw first_err;
      res.send(first_res);
    }
  );
});

module.exports = router;

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// client.messages
//   .create({
//      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//      from: '+15017122661',
//      to: '+15558675310'
//    })
//   .then(message => console.log(message.sid));
