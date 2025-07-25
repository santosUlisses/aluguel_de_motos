const authUser = (req, res, next) => {
    const user = req.session.userId
    if (!user) {
        return res.redirect('/');
    }
    next();
}

module.exports = authUser;