const router = require("express").Router();
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

module.exports = router;
