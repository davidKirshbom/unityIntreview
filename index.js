const express = require("express");
const sequelize = require("./DB/db");
require("./DB/models/File");
const downloadRouter = require("./routers/downloadRouter");
require("dotenv").config();

const app = express();

const port = 3000;

app.use(express.json());
app.use(downloadRouter);
app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ alter: true });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  console.log(`media server listening on port ${port}!`);
});
