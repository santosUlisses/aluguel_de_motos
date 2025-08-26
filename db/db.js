const { Sequelize } = require('sequelize');
require('dotenv').config();



const conn = new Sequelize("aluguelmotos", "root", process.env.db_senha, { host: "localhost", dialect: "mysql" });



module.exports = conn;