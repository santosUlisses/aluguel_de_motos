const bcrypt = require('bcrypt');
const User = require('../models/User');
const Moto = require('../models/Moto');
const Aluguel = require('../models/Aluguel');
const Pagamentos = require('../models/Pagamentos');
const service = require('../service/service')


class Metodos {
    homePage(req, res) {
        res.render('home');
    }

    pageCadastrar(req, res) {
        res.render('cadastrar_usuario');
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

                res.redirect('/painel/admin')
            }
            res.redirect('/lista/motos/user');
        } else {
            req.flash('msg_error', 'login ou senha inválido');
            res.redirect('/');
        }
    }

    painelUsuario(req, res) {
        res.render('painel_usuario');
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

        res.render('lista_users', { users });
    }


    painelAdm(req, res) {
        res.render('painel_adm');
    }

    pageCadastroMoto(req, res) {
        res.render('cadastro_moto');
    }

    async cadastroMoto(req, res) {
        const { nome, marca, cor } = req.body;
        try {
            await Moto.create({ nome, marca, cor });
            req.flash('msg_success', 'moto cadastrada');
            res.redirect('/moto/cadastro');
        } catch (error) {
            console.log(error);
            req.flash('msg_error', 'erro ao cadastrar');
            res.redirect('/moto/cadastro');

        }
    }

    async listarMotos(req, res) {
        const motos = (await Moto.findAll({ include: [{ model: User },] })).map(motos => motos.get({ plain: true }));
        const motosDisponiveis = motos.filter(motos => motos.disponibilidade === "disponivel");
        const motosAlugadas = motos.filter(moto => moto.disponibilidade === "alugada")


        res.render('lista_motos', { motosAlugadas, motosDisponiveis });
    }
    async listarMotosUser(req, res) {
        const motos = (await Moto.findAll({ include: [{ model: User },] })).map(motos => motos.get({ plain: true }));
        const motosDisponiveis = motos.filter(motos => motos.disponibilidade === "disponivel");
        res.render('lista_motos_user', { motosDisponiveis });
    }

    async pag_edit_user(req, res) {
        const id = req.session.userId
        const user = await User.findOne({ where: { id: id }, raw: true });
        res.render('pag_edit_user', { user });
    }

    async editUser(req, res) {
        const id = req.session.userId;
        const { nome, email, senha } = req.body;
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        try {
            await User.update({ nome, email, senha: senhaHash }, { where: { id: id } });
            req.flash('msg_success', 'dados atualizados');
            res.redirect(`/user/edit/${id}`);
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
            res.render('pag_alugar_moto', { user, motosDisponiveis });
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

    async pagEditarMoto(req, res) {
        const { id } = req.params;
        try {
            const moto = await Moto.findOne({ where: { id: id }, raw: true });
            console.log(moto);
            res.render('editar_moto', { moto });
        } catch (error) {
            console.log(error);
            res.redirect('/lista/motos')
        }
    }

    async editarMoto(req, res) {
        const { id, nome, marca, cor, disponibilidade } = req.body;
        console.log({ id, nome, marca, cor, disponibilidade })
        try {
            await Moto.update({ nome, marca, cor, disponibilidade }, { where: { id: id } });
            req.flash('msg_success', 'Dados atualizados!');
            res.redirect(`/moto/editar/${id}`);
        } catch (error) {
            console.log(error);
            req.flash('msg_error', 'Erro ao atualizar!');
            res.redirect(`/moto/editar/${id}`);
        }
    }


    // async pagEditarMotoUser(req, res) {
    //     const id = req.params.id;
    //     const user = (await User.findOne({ where: { id: id }, include: [{ model: Moto }] })).get({ plain: true });
    //     console.log(user);
    //     res.render('user_editar_moto', { user });
    // }

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
        res.render('pag_pagamento', { aluguel });

    }

    async pagamento(req, res) {
        const idAluguel = req.body.id;
        const userId = req.body.userId;
        const valor_pago = req.body.valor_pago;


        const dataPagamento = new Date();
        const dataVencimento = new Date(dataPagamento);
        try {
            await Pagamentos.create({ data_pagamento: dataPagamento, valor_pago, AluguelId: idAluguel, UserId: userId });

            await Aluguel.update({ data_vencimento: dataVencimento.setDate(dataVencimento.getDate() + 7) }, { where: { id: idAluguel } });
            res.redirect('/lista/users');
        } catch (error) {
            console.log(error);
            res.redirect('/lista/users');
        }
    }

    async listaPagamentosUser(req, res) {
        let id;
        if (req.session.admin) {
            id = req.params.id
        } else {
            id = req.session.userId;
        }

        try {
            const usuario = await User.findOne({ where: { id: id }, raw: true });
            const user = await User.findAll({ where: { id: id }, include: [{ model: Pagamentos, include: [{ model: Aluguel, include: [{ model: Moto, attributes: ['nome'] }] }] },], order: [[Pagamentos, 'id', 'DESC']] });
            const pagamentosLiquidados = user.flatMap(m => {
                const df = m.get({ plain: true });
                return df.Pagamentos.map(pag => ({
                    moto: pag.Aluguel?.Moto?.nome,
                    data_pagamento: service.formatarData(pag.data_pagamento),
                    valor_pago: pag.valor_pago,
                }));
            });


            res.render('lista_pagamentos', { pagamentosLiquidados, usuario });
        } catch (error) {
            console.log(error);
            res.redirect(`/lista/users`);
        }
    }

    async pagTotalLucro(req, res) {
        const lucro = await Pagamentos.sum('valor_pago');

        res.render('pag_lucro', { lucro });
    }

    async motosUser(req, res) {
        const id = req.session.userId;
        const motos = await Moto.findAll({ where: { UserId: id }, raw: true });
        console.log(motos)
        res.render('pag_motos_user', { motos })
    }

    async alugueisUsuario(req, res) {
        const id = req.session.userId;


        try {
            const alugueis = await Aluguel.findAll({ where: { UserId: id }, include: [{ model: Moto, attributes: ['nome'] }] });
            const aluguelFormatado = alugueis.map(a => a.get({ plain: true })).map(af => {
                return {
                    nome: af.Moto.nome,
                    status: af.status,
                    data_inicio: service.formatarData(af.data_inicio),
                    data_vencimento: service.formatarData(af.data_vencimento),
                    valor_aluguel: af.valor_aluguel,
                }
            });
            const aluguelAtivo = aluguelFormatado.filter(ativo => ativo.status === "ativo");
            const aluguelInativo = aluguelFormatado.filter(ativo => ativo.status === "inativo");



            res.render('alugueis_usuario', { aluguelAtivo, aluguelInativo });
        } catch (error) {
            console.log(error);
            redirect('/painel/usuario');
        }
    }



}


module.exports = new Metodos();