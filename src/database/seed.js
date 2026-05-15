const bcrypt = require('bcryptjs');
const db = require('./db');

const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@biblioteca.com');

if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
    'Administrador', 'admin@biblioteca.com', hashedPassword, 'admin'
  );
  console.log('Admin criado: admin@biblioteca.com / admin123');
}

const leitorExists = db.prepare('SELECT id FROM users WHERE email = ?').get('leitor@biblioteca.com');

if (!leitorExists) {
  const hashedPassword = bcrypt.hashSync('leitor123', 10);
  db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
    'Maria Leitora', 'leitor@biblioteca.com', hashedPassword, 'leitor'
  );
  console.log('Leitor criado: leitor@biblioteca.com / leitor123');
}

const bookCount = db.prepare('SELECT COUNT(*) as count FROM books').get().count;

if (bookCount === 0) {
  const insertBook = db.prepare('INSERT INTO books (title, author, isbn, quantity, available) VALUES (?, ?, ?, ?, ?)');
  const books = [
    ['Dom Casmurro', 'Machado de Assis', '978-85-359-0277-1', 3, 3],
    ['O Cortico', 'Aluisio Azevedo', '978-85-359-0278-8', 2, 2],
    ['Vidas Secas', 'Graciliano Ramos', '978-85-359-0279-5', 2, 2],
    ['Capitaes da Areia', 'Jorge Amado', '978-85-359-0280-1', 1, 1],
    ['A Moreninha', 'Joaquim Manuel de Macedo', '978-85-359-0281-8', 2, 2],
  ];

  for (const book of books) {
    insertBook.run(...book);
  }
  console.log(`${books.length} livros inseridos.`);
}

console.log('Seed concluido!');
