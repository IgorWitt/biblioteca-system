const authService = require('../services/authService');

module.exports = {
  loginPage(req, res) {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('auth/login', { error: null });
  },

  async loginPost(req, res) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    if (result.error) {
      return res.render('auth/login', { error: result.error });
    }

    req.session.user = result.user;
    res.redirect('/dashboard');
  },

  registerPage(req, res) {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('auth/register', { error: null });
  },

  async registerPost(req, res) {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });

    if (result.error) {
      return res.render('auth/register', { error: result.error });
    }

    req.session.user = result.user;
    res.redirect('/dashboard');
  },

  logout(req, res) {
    req.session.destroy();
    res.redirect('/login');
  },
};
