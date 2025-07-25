const authAdm = (req, res, next) => {
    const userAdmin = req.session.admin;
    if (!userAdmin) {
        return res.redirect('/lista/motos/user');
    }
    next();
}

module.exports = authAdm;