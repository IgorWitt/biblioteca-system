const express = require('express');
const session = require('express-session');
const path = require('path');

const authController = require('./controllers/authController');
const bookController = require('./controllers/bookController');
const loanController = require('./controllers/loanController');
const { isAuthenticated, isAdmin } = require('./middlewares/auth');

const app = express();
const PORT = 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(
  session({
    secret: 'biblioteca-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 }, // 2 horas
  })
);

// --- Rotas de Autenticacao ---
app.get('/login', authController.loginPage);
app.post('/login', authController.loginPost);
app.get('/register', authController.registerPage);
app.post('/register', authController.registerPost);
app.get('/logout', authController.logout);

// --- Dashboard ---
app.get('/', isAuthenticated, (req, res) => res.redirect('/dashboard'));
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

// --- Rotas de Livros ---
app.get('/books', isAuthenticated, bookController.list);
app.get('/books/new', isAuthenticated, isAdmin, bookController.createPage);
app.post('/books', isAuthenticated, isAdmin, bookController.createPost);
app.get('/books/:id/edit', isAuthenticated, isAdmin, bookController.editPage);
app.post('/books/:id', isAuthenticated, isAdmin, bookController.editPost);
app.post('/books/:id/delete', isAuthenticated, isAdmin, bookController.delete);

// --- Rotas de Emprestimos ---
app.get('/loans', isAuthenticated, loanController.list);
app.get('/loans/borrow', isAuthenticated, loanController.borrowPage);
app.post('/loans/borrow', isAuthenticated, loanController.borrowPost);
app.post('/loans/:id/return', isAuthenticated, loanController.returnBook);

// Error page fallback
app.use((req, res) => {
  res.status(404).render('error', { user: req.session ? req.session.user : null, message: 'Pagina nao encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
