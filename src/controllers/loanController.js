const loanService = require('../services/loanService');
const bookService = require('../services/bookService');

module.exports = {
  list(req, res) {
    const user = req.session.user;
    let loans;

    if (user.role === 'admin') {
      loans = loanService.listAll();
    } else {
      loans = loanService.listByUser(user.id);
    }

    res.render('loans/index', { user, loans });
  },

  borrowPage(req, res) {
    const books = bookService.listAll().filter((b) => b.available > 0);
    res.render('loans/borrow', { user: req.session.user, books, error: null });
  },

  borrowPost(req, res) {
    const userId = req.session.user.id;
    const bookId = parseInt(req.body.book_id, 10);
    const result = loanService.borrow(userId, bookId);

    if (result.error) {
      const books = bookService.listAll().filter((b) => b.available > 0);
      return res.render('loans/borrow', { user: req.session.user, books, error: result.error });
    }

    res.redirect('/loans');
  },

  returnBook(req, res) {
    const loanId = parseInt(req.params.id, 10);
    const user = req.session.user;
    loanService.returnBook(loanId, user.id, user.role);
    res.redirect('/loans');
  },
};
