const express = require("express");
const cors = require("cors");
const conn = require("./database/db");
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
