function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/login');
}

function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).render('error', {
    user: req.session.user,
    message: 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.',
  });
}

module.exports = { isAuthenticated, isAdmin };
