const bookRepository = require('../repositories/bookRepository');
const loanRepository = require('../repositories/loanRepository');

module.exports = {
  listAll() {
    return bookRepository.findAll();
  },

  findById(id) {
    return bookRepository.findById(id);
  },

  create(data) {
    const quantity = parseInt(data.quantity, 10);
    if (quantity < 1) return { error: 'Quantidade deve ser pelo menos 1' };
    return { id: bookRepository.create({ ...data, quantity }) };
  },

  update(id, data) {
    const book = bookRepository.findById(id);
    if (!book) return { error: 'Livro nao encontrado' };

    const quantity = parseInt(data.quantity, 10);
    const loansActive = quantity - parseInt(data.available, 10);
    if (parseInt(data.available, 10) < 0) return { error: 'Disponivel nao pode ser negativo' };

    bookRepository.update(id, data);
    return { success: true };
  },

  delete(id) {
    const book = bookRepository.findById(id);
    if (!book) return { error: 'Livro nao encontrado' };

    const activeLoans = loanRepository.findAll().filter(
      (l) => l.book_id === id && l.status === 'ativo'
    );
    if (activeLoans.length > 0) return { error: 'Nao e possivel excluir livro com emprestimos ativos' };

    bookRepository.delete(id);
    return { success: true };
  },
};
