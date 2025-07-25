const express = require('express');
const router = express.Router();
const Metodos = require('../controller/controller');
const authUser = require('../middleware/authUser');
const authAdm = require('../middleware/authAdmin');



router.get('/', Metodos.homePage);
router.get('/cadastrar', Metodos.pageCadastrar);
router.post('/cadastrar', Metodos.cadastrar);
router.post('/login', Metodos.login);
router.get('/logout', Metodos.logout);
router.get('/paineladm', authAdm, Metodos.paineladm);
router.get('/moto/cadastro', authAdm, Metodos.pageCadastroMoto);
router.post('/moto/cadastro', Metodos.cadastroMoto);
router.get('/lista/motos', authAdm, Metodos.listarMotos);
router.get('/lista/motos/user', authUser, Metodos.listarMotosUser);
router.get('/lista/users', authAdm, Metodos.listaUsers);
router.get('/user/edit/:id', authUser, Metodos.pagEditUser);
router.post('/user/editar', Metodos.editUser);
router.get('/alugarmoto/:id', authAdm, Metodos.pagAlugarMoto);
router.post('/moto/alugar', Metodos.alugarMoto);
router.get('/user/pagamento/:id', authAdm, Metodos.pagPagamento);
router.post('/user/editarmoto/:id', Metodos.pagEditarMotoUser);
router.post('/moto/remover/:id', Metodos.removerMoto);
router.post('/moto/pagamento', Metodos.pagamento);
router.get('/lista/pagamentos/:id', authAdm, Metodos.listaPagamentosUser);
router.get('/pagLucro', authAdm, Metodos.pagTotalLucro);
router.get('/pagMotosUser', authUser, Metodos.motosUser);

module.exports = router;