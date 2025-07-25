const { DataTypes, ENUM } = require('sequelize');

const conn = require('../db/db');


const Aluguel = conn.define("Aluguel", {
    data_inicio: {
        type: DataTypes.DATEONLY
    },
    data_vencimento: {
        type: DataTypes.DATEONLY,
    },
    valor_aluguel: {
        type: DataTypes.DECIMAL(10, 2),
    },
    status: {
        type: ENUM("ativo", "vencido","inativo"),
        defaultValue: "ativo",
    }
}, { tableName: "aluguel" });


module.exports = Aluguel;