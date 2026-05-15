const db = require('../database/db');

module.exports = {
  findAll() {
    return db.prepare('SELECT * FROM books ORDER BY title').all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM books WHERE id = ?').get(id);
  },

  create({ title, author, isbn, quantity }) {
    const result = db.prepare(
      'INSERT INTO books (title, author, isbn, quantity, available) VALUES (?, ?, ?, ?, ?)'
    ).run(title, author, isbn, quantity, quantity);
    return result.lastInsertRowid;
  },

  update(id, { title, author, isbn, quantity, available }) {
    return db.prepare(
      'UPDATE books SET title = ?, author = ?, isbn = ?, quantity = ?, available = ? WHERE id = ?'
    ).run(title, author, isbn, quantity, available, id);
  },

  delete(id) {
    return db.prepare('DELETE FROM books WHERE id = ?').run(id);
  },

  decrementAvailable(id) {
    return db.prepare('UPDATE books SET available = available - 1 WHERE id = ? AND available > 0').run(id);
  },

  incrementAvailable(id) {
    return db.prepare('UPDATE books SET available = available + 1 WHERE id = ?').run(id);
  },
};
