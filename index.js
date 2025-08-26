const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const app = express();
const router = require('./router/routers');
const conn = require('./db/db');
require('dotenv').config();
const User = require('./models/User')
const Moto = require('./models/Moto')
const Aluguel = require('./models/Aluguel')
const Pagamentos = require('./models/Pagamentos')
const relacionamento = require('./models/relacionamento');


app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: " ",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 360000000 },
}));

app.use((req, res, next) => {
    res.locals.nome = req.session.nome || null;
    res.locals.id = !!req.session.id;
    res.locals.admin = !!req.session.admin;
    next();
})

app.use('/', router);

conn.sync({ force: false }).then(() => { app.listen(3000) }).catch(error => console.log(error));