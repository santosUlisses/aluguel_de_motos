class Autenticar {
    authAdm(req, res, next) {
        const userAdmin = !!req.session.admin;
        if (!userAdmin) {
            return res.redirect('/painel/usuario');
        }
        next();
    }

    authUser(req, res, next) {
        const user = req.session.userId
        if (!user) {
            return res.redirect('/');
        }
        next();
    }

}

module.exports = new Autenticar();