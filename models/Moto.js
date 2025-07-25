const { DataTypes, ENUM } = require('sequelize');


const conn = require('../db/db');

const Moto = conn.define("Moto", {
    nome: {
        type: DataTypes.STRING,
        required: true,
    },
    marca: {
        type: DataTypes.STRING,
        required: true,
    },
    cor: {
        type: DataTypes.STRING,
        required: true,
    }
    ,
    disponibilidade: {
        type: DataTypes.ENUM("disponivel", "alugada"),
        defaultValue: "disponivel",
    }
});



module.exports = Moto;