const router = require("express").Router();
const e = require("express");
const conn = require("../database/db");

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

module.exports = router;
