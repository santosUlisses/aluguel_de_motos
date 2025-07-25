const bcrypt = require('bcrypt');
const User = require('../models/User');
const Moto = require('../models/Moto');
const Aluguel = require('../models/Aluguel');
const Pagamentos = require('../models/Pagamentos');



class Metodos {
    homePage(req, res) {
        res.render('home');
    }
    pageCadastrar(req, res) {
        res.render('cadastrar');
    }
    async cadastrar(req, res) {
        const { nome, email, senha } = req.body;

        const salt = await bcrypt.genSalt(10)
        const senhaCript = await bcrypt.hash(senha, salt);
        console.log(senhaCript);
        try {
            await User.create({ nome, email, senha: senhaCript });
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    }
    async login(req, res) {
        const { nome, senha } = req.body;
        const user = await User.findOne({ where: { nome: nome }, raw: true });
        let auth = await bcrypt.compare(senha, user.senha);
        if (auth === true) {
            req.session.userId = user.id
            req.session.nome = user.nome
            console.log(req.session);
            if (req.session.userId === 1) {
                req.session.admin = 'admin'
                console.log(req.session);

                res.redirect('/paineladm')
            }
            res.redirect('/lista/motos/user');
        } else {
            res.render('home', { error: true });
        }
    }

    logout(req, res) {
        req.session.destroy((error) => {
            if (error) {
                console.log(error);
            }
            res.clearCookie('connect.sid')
            res.redirect('/');
        });
    }

    async listaUsers(req, res) {
        const users = (await User.findAll({ include: { model: Moto } })).map(user => user.get({ plain: true })).filter(user => user.id !== 1);
        console.log(users)
        res.render('listaUsers', { users });
    }


    paineladm(req, res) {
        res.render('paineladm');
    }
    pageCadastroMoto(req, res) {
        res.render('cadastroMoto');
    }
    async cadastroMoto(req, res) {
        const { nome, marca, cor } = req.body;
        try {
            await Moto.create({ nome, marca, cor });
            res.redirect('/paineladm');
        } catch (error) {
            console.log(error);
        }
    }

    async listarMotos(req, res) {
        const motos = (await Moto.findAll({ include: [{ model: User },] })).map(motos => motos.get({ plain: true }));
        const motosDisponiveis = motos.filter(motos => motos.disponibilidade === "disponivel");
        const motosAlugadas = motos.filter(moto => moto.disponibilidade === "alugada")
        // console.log(motos);

        res.render('listaMotos', { motosAlugadas, motosDisponiveis });
    }
    async listarMotosUser(req, res) {
        const motos = (await Moto.findAll({ include: [{ model: User },] })).map(motos => motos.get({ plain: true }));
        const motosDisponiveis = motos.filter(motos => motos.disponibilidade === "disponivel");
        res.render('listaMotosUser', { motosDisponiveis });
    }

    async pagEditUser(req, res) {
        const id = req.session.userId
        const user = await User.findOne({ where: { id: id }, raw: true });
        res.render('pagEditUser', { user });
    }

    async editUser(req, res) {
        const id = req.session.userId;
        const nome = req.body.nome;
        const email = req.body.email;
        const senha = req.body.senha;
        console.log(id, nome, email, senha);
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        try {
            await User.update({ nome, email, senha: senhaHash }, { where: { id: id } });
            res.redirect('/lista/motos/user');
        } catch (error) {
            console.log(error);
        }
    }

    async pagAlugarMoto(req, res) {
        const id = req.params.id;
        try {
            const [user, motosDisponiveis] = await Promise.all([
                User.findOne({ where: { id: id }, raw: true }),
                Moto.findAll({ where: { disponibilidade: "disponivel" }, raw: true })
            ]);
            res.render('pagAlugarMoto', { user, motosDisponiveis });
        } catch (error) {
            console.log(error);
        }
    }

    async alugarMoto(req, res) {
        const { id, idMoto, data_inicio, data_vencimento, valor_aluguel } = req.body;
        console.log({ id, idMoto, data_inicio, data_vencimento, valor_aluguel });

        try {
            await Moto.update({ disponibilidade: "alugada", UserId: id }, { where: { id: idMoto } });
            await Aluguel.create({ data_inicio, data_vencimento, valor_aluguel, MotoId: idMoto, UserId: id });
            res.redirect('/lista/users');
        } catch (error) {
            console.log(error);
        }
    }


    async pagEditarMotoUser(req, res) {
        const id = req.params.id;
        const user = (await User.findOne({ where: { id: id }, include: [{ model: Moto }] })).get({ plain: true });
        console.log(user);
        res.render('userEditarMoto', { user });
    }

    async removerMoto(req, res) {
        const { idMoto } = req.body
        try {


            const findAluguel = await Aluguel.findOne({ where: { MotoId: idMoto }, order: [['id', "DESC"]], raw: true });
            await Promise.all([
                Moto.update({ disponibilidade: "disponivel", UserId: 1 }, { where: { id: idMoto } }),
                Aluguel.update({ status: "inativo" }, { where: { id: findAluguel.id } }),
            ])
            res.redirect('/lista/users');
        } catch (error) {
            console.log(error);
        }
    }

    async pagPagamento(req, res) {
        const motoId = req.params.id
        const aluguel = await Aluguel.findOne({ where: { MotoId: motoId }, order: [["id", "DESC"]], raw: true });
        console.log(aluguel);
        res.render('pagPagamento', { aluguel });

    }

    async pagamento(req, res) {
        const idAluguel = req.body.id;
        const userId = req.body.userId;
        const valor_pago = req.body.valor_pago;
        const dataPagamento = new Date()
        try {
            await Pagamentos.create({ data_pagamento: dataPagamento, valor_pago, AluguelId: idAluguel, UserId: userId });
            const dataVencimento = `'${dataPagamento.getFullYear()}-${dataPagamento.getMonth() + 1}-${dataPagamento.getDate() + 7}'`
            await Aluguel.update({ data_inicio: dataPagamento, data_vencimento: dataVencimento }, { where: { id: idAluguel } });
            res.redirect('/lista/users');
        } catch (error) {
            console.log(error);
        }
    }
    async listaPagamentosUser(req, res) {
        const id = req.params.id

        const user = await User.findOne({ where: { id: id }, include: [{ model: Aluguel, include: [Moto] }, { model: Pagamentos, include: [{ model: Aluguel, include: [Moto] }] }, { model: Moto }], });

        const alugueisAtivos = user.Aluguels.map(a => a.get({ plain: true },)).filter(a => a.status === "ativo");
        const alugueisInativos = user.Aluguels.map(a => a.get({ plain: true },)).filter(a => a.status === "inativo");
        const pagamentosLiquidados = user.Pagamentos.map(p => p.get({ plain: true }));

        console.log(user.Pagamentos[0].Aluguel?.Moto?.nome);


        res.render('listaPagamentos', { pagamentosLiquidados, user: user.get({ plain: true }), alugueisAtivos, alugueisInativos });
    }

    async pagTotalLucro(req, res) {
        const lucro = await Pagamentos.sum('valor_pago');

        res.render('pagLucro', { lucro });
    }

    async motosUser(req, res) {
        const id = req.session.userId;
        const motos = await Moto.findAll({ where: { UserId: id }, raw: true });
        console.log(motos)
        res.render('pagMotosUser', { motos })
    }
}


module.exports = new Metodos();