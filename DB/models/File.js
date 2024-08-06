const { Sequelize, DataTypes } = require("sequelize");
const db = require("../db");
const File = db.define("File", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  name: {
    unique: true,
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  binary: {
    type: DataTypes.BLOB("long"),
  },
});

module.exports = File;
