const express = require('express');
const router = express.Router();
const Metodos = require('../controller/controller');
const Autenticar = require('../middleware/autenticar');



router.get('/', Metodos.homePage);
router.get('/cadastrar', Metodos.pageCadastrar);
router.post('/cadastrar', Metodos.cadastrar);
router.post('/login', Metodos.login);
router.get('/logout', Metodos.logout);
router.get('/paineladm', Autenticar.authAdm, Metodos.paineladm);
router.get('/painel/usuario', Autenticar.authUser, Metodos.painelUsuario);
router.get('/moto/cadastro', Autenticar.authAdm, Metodos.pageCadastroMoto);
router.post('/moto/cadastro', Metodos.cadastroMoto);
router.get('/lista/motos', Autenticar.authAdm, Metodos.listarMotos);
router.get('/lista/motos/user', Autenticar.authUser, Metodos.listarMotosUser);
router.get('/lista/users', Autenticar.authAdm, Metodos.listaUsers);
router.get('/user/edit/:id', Autenticar.authUser, Metodos.pagEditUser);
router.post('/user/editar', Metodos.editUser);
router.get('/alugarmoto/:id', Autenticar.authAdm, Metodos.pagAlugarMoto);
router.post('/moto/alugar', Metodos.alugarMoto);
router.get('/user/pagamento/:id', Autenticar.authAdm, Metodos.pagPagamento);
router.post('/user/editarmoto/:id', Metodos.pagEditarMotoUser);
router.post('/moto/remover/:id', Metodos.removerMoto);
router.post('/moto/pagamento', Metodos.pagamento);
router.get('/lista/pagamentos/:id', Metodos.listaPagamentosUser);
router.get('/pagLucro', Autenticar.authAdm, Metodos.pagTotalLucro);
router.get('/pagMotosUser', Autenticar.authUser, Metodos.motosUser);
router.get('/alugueis/usuario/:id', Autenticar.authUser, Metodos.alugueisUsuario);

module.exports = router;