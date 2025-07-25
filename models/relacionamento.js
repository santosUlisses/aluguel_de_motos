const User = require('./User');
const Moto = require('./Moto');
const Aluguel = require('./Aluguel');
const Pagamentos = require('./Pagamentos');

User.hasMany(Moto);
Moto.belongsTo(User);


User.hasMany(Aluguel);
Aluguel.belongsTo(User);


Moto.hasMany(Aluguel);
Aluguel.belongsTo(Moto);


User.hasMany(Pagamentos);
Pagamentos.belongsTo(User);


Aluguel.hasMany(Pagamentos);
Pagamentos.belongsTo(Aluguel);

module.exports = {
    User,
    Moto,
    Aluguel,
    Pagamentos
};
