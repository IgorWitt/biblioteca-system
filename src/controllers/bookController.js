const bookService = require('../services/bookService');

module.exports = {
  list(req, res) {
    const books = bookService.listAll();
    res.render('books/index', { user: req.session.user, books });
  },

  createPage(req, res) {
    res.render('books/create', { user: req.session.user, error: null });
  },

  createPost(req, res) {
    const result = bookService.create(req.body);
    if (result.error) {
      return res.render('books/create', { user: req.session.user, error: result.error });
    }
    res.redirect('/books');
  },

  editPage(req, res) {
    const book = bookService.findById(parseInt(req.params.id, 10));
    if (!book) return res.redirect('/books');
    res.render('books/edit', { user: req.session.user, book, error: null });
  },

  editPost(req, res) {
    const id = parseInt(req.params.id, 10);
    const result = bookService.update(id, req.body);
    if (result.error) {
      const book = bookService.findById(id);
      return res.render('books/edit', { user: req.session.user, book, error: result.error });
    }
    res.redirect('/books');
  },

  delete(req, res) {
    const id = parseInt(req.params.id, 10);
    const result = bookService.delete(id);
    if (result.error) {
      return res.redirect('/books?error=' + encodeURIComponent(result.error));
    }
    res.redirect('/books');
  },
};
