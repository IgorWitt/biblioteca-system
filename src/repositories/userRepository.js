const db = require('../database/db');

module.exports = {
  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  findById(id) {
    return db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(id);
  },

  findAll() {
    return db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY name').all();
  },

  create({ name, email, password, role = 'leitor' }) {
    const result = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(name, email, password, role);
    return result.lastInsertRowid;
  },
};
