const { DataTypes } = require('sequelize');

const conn = require('../db/db');

const User = conn.define("User", {
    nome: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    senha: {
        type: DataTypes.STRING,
    }
});


module.exports = User;