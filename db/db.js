const { Sequelize } = require('sequelize');

const conn = new Sequelize("aluguelmotos", "root", "", { host: "localhost", dialect: "mysql" });



module.exports = conn;