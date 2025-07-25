const { DataTypes } = require('sequelize');
const conn = require('../db/db');


const Pagamento = conn.define("Pagamento", {
    data_pagamento: {
        type: DataTypes.DATEONLY,
    },
    valor_pago: {
        type: DataTypes.DECIMAL(10, 2),
    },
});


module.exports = Pagamento;
