const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("unity", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  sync: true,
});

module.exports = sequelize;
