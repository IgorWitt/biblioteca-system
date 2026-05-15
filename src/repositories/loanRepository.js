const db = require('../database/db');

module.exports = {
  findAll() {
    return db.prepare(`
      SELECT loans.*, users.name as user_name, books.title as book_title
      FROM loans
      JOIN users ON loans.user_id = users.id
      JOIN books ON loans.book_id = books.id
      ORDER BY loans.loan_date DESC
    `).all();
  },

  findByUserId(userId) {
    return db.prepare(`
      SELECT loans.*, books.title as book_title, books.author as book_author
      FROM loans
      JOIN books ON loans.book_id = books.id
      WHERE loans.user_id = ?
      ORDER BY loans.loan_date DESC
    `).all(userId);
  },

  findById(id) {
    return db.prepare('SELECT * FROM loans WHERE id = ?').get(id);
  },

  findActiveLoan(userId, bookId) {
    return db.prepare(
      "SELECT * FROM loans WHERE user_id = ? AND book_id = ? AND status = 'ativo'"
    ).get(userId, bookId);
  },

  countActiveByUser(userId) {
    return db.prepare(
      "SELECT COUNT(*) as count FROM loans WHERE user_id = ? AND status = 'ativo'"
    ).get(userId).count;
  },

  create({ userId, bookId, dueDate }) {
    const result = db.prepare(
      'INSERT INTO loans (user_id, book_id, due_date) VALUES (?, ?, ?)'
    ).run(userId, bookId, dueDate);
    return result.lastInsertRowid;
  },

  returnLoan(id) {
    return db.prepare(
      "UPDATE loans SET status = 'devolvido', return_date = CURRENT_TIMESTAMP WHERE id = ?"
    ).run(id);
  },
};
